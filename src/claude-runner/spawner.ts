import { spawnSync } from 'child_process'

export interface SpawnResult {
  exitCode: number
  stdout: string
  stderr: string
}

/**
 * claude CLI를 실행한다.
 *
 * 구현 선택:
 * - spawnSync + stdio: 'inherit'를 사용하여 실시간 출력 지원
 * - stdout/stderr 수집은 포기 (Phase 지시사항 참조)
 * - dry-run 모드: CC_DRY_RUN=1이면 실제 spawn 없이 명령어 출력
 */
export function spawnClaude(flags: string[]): SpawnResult {
  // dry-run 모드
  if (process.env.CC_DRY_RUN === '1') {
    const command = ['claude', ...flags].join(' ')
    process.stdout.write(`[DRY-RUN] ${command}\n`)
    return {
      exitCode: 0,
      stdout: '',
      stderr: '',
    }
  }

  const result = spawnSync('claude', flags, {
    stdio: 'inherit',
  })

  return {
    exitCode: result.status ?? 1,
    stdout: '',
    stderr: '',
  }
}
