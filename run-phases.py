#!/usr/bin/env python3
"""
cc-company phase runner.
Reads tasks/index.json, finds the next pending phase,
spawns a Claude Code session with the phase prompt, and updates status.
"""

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent
TASKS_DIR = ROOT / "tasks"
INDEX_FILE = TASKS_DIR / "index.json"

COMMON_PREAMBLE = """
당신은 cc-company 프로젝트의 개발자입니다. 아래 phase의 작업을 수행하세요.

중요한 규칙:
1. 작업 전에 반드시 /docs/ 하위 문서(spec.md, architecture.md, adr.md, testing.md, test-cases.md)를 읽고 전체 설계를 이해하세요.
2. 이전 phase에서 작성된 코드를 꼼꼼히 읽고, 기존 코드와의 일관성을 유지하세요.
3. AC 검증을 직접 수행하고, 통과/실패에 따라 /tasks/index.json을 업데이트하세요.
4. 불필요한 파일이나 코드를 추가하지 마세요. phase에 명시된 것만 작업하세요.
5. 기존 테스트를 깨뜨리지 마세요.

아래는 이번 phase의 상세 내용입니다:

"""


def load_index() -> dict:
    with open(INDEX_FILE, "r") as f:
        return json.load(f)


def find_next_phase(index: dict) -> dict | None:
    for phase in index["phases"]:
        if phase["status"] == "pending":
            return phase
    return None


def get_last_phase(index: dict) -> dict | None:
    for phase in reversed(index["phases"]):
        if phase["status"] != "pending":
            return phase
    return None


def load_phase_prompt(phase_num: int) -> str:
    phase_file = TASKS_DIR / f"phase{phase_num}.md"
    if not phase_file.exists():
        print(f"ERROR: {phase_file} not found")
        sys.exit(1)
    return phase_file.read_text()


def run_phase(phase: dict) -> dict:
    phase_num = phase["phase"]
    phase_name = phase["name"]
    prompt_content = load_phase_prompt(phase_num)

    full_prompt = COMMON_PREAMBLE + prompt_content

    print(f"\n{'='*60}")
    print(f"  Phase {phase_num}: {phase_name}")
    print(f"{'='*60}\n")

    output_file = TASKS_DIR / f"phase{phase_num}-output.json"

    cmd = [
        "claude",
        "-p",
        "--dangerously-skip-permissions",
        "--output-format", "json",
        full_prompt,
    ]

    result = subprocess.run(
        cmd,
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        timeout=600,  # 10 minutes per phase
    )

    # Save output
    output_data = {
        "phase": phase_num,
        "name": phase_name,
        "exitCode": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
    }

    with open(output_file, "w") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"Output saved to {output_file}")

    if result.returncode != 0:
        print(f"\nWARN: Claude exited with code {result.returncode}")
        print(f"stderr: {result.stderr[:500]}")

    return output_data


def check_phase_status(index: dict, phase_num: int) -> str:
    """Re-read index.json to get the updated status after Claude's run."""
    fresh_index = load_index()
    for phase in fresh_index["phases"]:
        if phase["phase"] == phase_num:
            return phase.get("status", "pending")
    return "pending"


def main():
    print("cc-company Phase Runner")
    print("=" * 60)

    index = load_index()

    # Check if last non-pending phase is error
    last = get_last_phase(index)
    if last and last["status"] == "error":
        print(f"\nERROR: Phase {last['phase']} ({last['name']}) failed.")
        if "error_message" in last:
            print(f"Error: {last['error_message']}")
        print("Fix the issue and reset the status to 'pending' in tasks/index.json to retry.")
        sys.exit(1)

    while True:
        index = load_index()
        phase = find_next_phase(index)

        if phase is None:
            print("\nAll phases completed!")
            break

        run_phase(phase)

        # Re-read index.json to check what Claude did
        status = check_phase_status(index, phase["phase"])

        if status == "error":
            # Re-read to get error message
            fresh_index = load_index()
            for p in fresh_index["phases"]:
                if p["phase"] == phase["phase"]:
                    print(f"\nERROR: Phase {phase['phase']} ({phase['name']}) failed.")
                    if "error_message" in p:
                        print(f"Error: {p['error_message']}")
                    break
            print("Fix the issue and reset the status to 'pending' in tasks/index.json to retry.")
            sys.exit(1)

        if status == "completed":
            print(f"\nPhase {phase['phase']} ({phase['name']}) completed successfully.")
        elif status == "pending":
            # Claude didn't update index.json — treat as error
            print(f"\nWARN: Phase {phase['phase']} status still 'pending' after execution.")
            print("Claude may not have updated index.json. Marking as error.")

            fresh_index = load_index()
            for p in fresh_index["phases"]:
                if p["phase"] == phase["phase"]:
                    p["status"] = "error"
                    p["error_message"] = "Claude did not update index.json status"
                    break
            with open(INDEX_FILE, "w") as f:
                json.dump(fresh_index, f, indent=2, ensure_ascii=False)

            sys.exit(1)

    print("\n" + "=" * 60)
    print("  All phases completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    main()
