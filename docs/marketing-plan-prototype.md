# Marketing Plan Prototype

> 초안. 검토 후 논의 예정.

## 채널 전략

### Primary: Threads (팔로워 11K)

가장 빠른 채널. 이미 확보된 오디언스이며, 테크/AI 관심 유저 비중이 높을 것으로 추정.

**콘텐츠 시리즈 (런칭 주)**

1. **티저 (D-3~D-1)**: 문제 공감형 포스트
   - "Claude Code 세션 열 때마다 같은 시스템 프롬프트 복붙하고 있는 사람?"
   - "AI한테 일 시키는데 매번 처음부터 설명하는 거 지겹지 않음?"
   - 반응 보면서 타겟 페인포인트 확인

2. **런칭 (D-day)**: 데모 영상 + 원라이너
   - 30초 터미널 영상: `cc-company init` → `run developer` → `run designer` 전환
   - 핵심 카피: "Claude Code를 회사처럼 굴린다. CEO처럼 지시만 하면 된다."
   - GitHub 링크 + `npm install -g cc-company`

3. **후속 (D+1~D+7)**: 유스케이스별 쪼개서 연재
   - "developer agent에 커스텀 subagent 추가하는 법"
   - "디자이너 없이 디자인 시스템 만드는 법 (designer agent)"
   - "채용 JD를 AI로 5분 만에 쓰는 법 (hr agent)"

**톤**: 실용적이고 날것. 과장 없이 "이게 되는데, 써볼래?" 정도.

### Secondary: Claude Code 커뮤니티

- **Reddit r/ClaudeAI**: 런칭 후 사용기 형태로 포스팅 (광고 느낌 배제)
- **Claude Code Discord**: 관련 채널에 자연스럽게 공유
- **X(Twitter)**: Threads 콘텐츠 크로스포스팅 + AI/개발자 인플루언서 태그

### 보류: Product Hunt

초기 피드백 루프가 확보된 후 (유저 20~50명 수준). 너무 이르면 피드백 없이 트래픽만 소모.

---

## 유저 수집 & 계측 전략

시스템 텔레메트리 없이 유저를 추적하는 방법.

### 1. GitHub Stars + Issues = 1차 지표

- Star 수 = 관심도
- Issue/Discussion 활성도 = 실사용 여부
- README에 "문제 있으면 Issue, 아이디어 있으면 Discussion" CTA 명시

### 2. 연락처 수집 경로

**A. GitHub Discussion에 "Show Your Setup" 스레드**
- "당신의 .cc-company/ 구조를 공유해주세요" 형태
- 자연스럽게 활성 유저 식별 + 사용 패턴 파악

**B. Threads 포스트 CTA → DM 유도**
- "써보고 피드백 주실 분 DM 주세요 — 초기 유저는 직접 서포트합니다"
- DM으로 1:1 관계 형성 → 사용 패턴, 불만, 요구사항 직접 수집

**C. README에 Early Adopter 폼 링크**
- Google Form 또는 Tally 등 간단한 폼
- "초기 피드백 주시면 로드맵에 반영 + 크레딧" 정도의 인센티브
- 수집 항목: 이메일, 어떤 용도로 쓸 예정인지, Claude Code 사용 빈도

**D. Discord 커뮤니티 (유저 30명+ 이후)**
- 그 전까지는 GitHub Discussion으로 충분
- 유저가 모이면 cc-company 전용 Discord 또는 기존 채널 활용

### 3. 핵심 가설 검증 방법

가설: "Claude Code 유저는 직무별 agent 분리를 원한다"

텔레메트리 없이 검증하는 법:
- GitHub Discussion/DM에서 직접 질문: "agent 몇 개 쓰고 있나요?"
- Issue에서 "새로운 agent 타입 요청" 빈도 추적
- 초기 유저 10명과 15분 콜 → 실사용 여부, agent 개수, 가장 많이 쓰는 agent 확인

**성공 기준**: 초기 유저 중 30%+가 agent 2개 이상 사용 (자기 보고 기반)

---

## 타임라인

| 일정 | 액션 |
|---|---|
| D-3~D-1 | Threads 티저 포스트 (문제 공감) |
| D-day | npm publish + Threads 런칭 포스트 + GitHub public |
| D+1 | Reddit r/ClaudeAI 사용기 포스팅 |
| D+2~D+7 | Threads 유스케이스 연재 (3~4편) |
| D+7 | 초기 유저 DM 수집 시작, 피드백 정리 |
| D+14 | 초기 유저 10명 목표 달성 → 1:1 콜 시작 |
| D+21 | 가설 검증 중간 점검 → 피벗 or 대시보드 착수 판단 |

---

## 핵심 메시지

**원라이너**: Claude Code를 회사처럼 굴려라.

**엘리베이터 피치**: cc-company는 Claude Code를 직무별 AI agent로 조직화하는 CLI다. developer, designer, HR — 각 역할에 맞는 프롬프트와 전문성을 미리 세팅해두고, 한 줄 명령으로 실행한다. 매번 처음부터 설명할 필요 없다.

**차별점**: Claude Code의 공식 기능(subagent, skills, hooks)을 그대로 활용하면서, "직무" 단위로 묶어주는 것. 새로운 AI가 아니라, 기존 도구의 생산성을 극대화하는 레이어.
