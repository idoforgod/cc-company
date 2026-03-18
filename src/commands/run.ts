import { Command } from 'commander'
import { createContext } from './context.js'

export function registerRunCommand(program: Command): void {
  program
    .command('run')
    .description('Run an agent with a prompt')
    .argument('<agent>', 'Agent name')
    .argument('<prompt>', 'Prompt to send to the agent')
    .allowUnknownOption()
    .allowExcessArguments()
    .action((agent: string, prompt: string, _options: unknown, command: Command) => {
      const ctx = createContext()

      // 패스스루 플래그 추출: commander의 args에서 포지셔널 2개 제외
      // command.args는 전체 인자 목록 (포지셔널 + 알 수 없는 옵션)
      // 그러나 commander의 동작상 알 수 없는 옵션은 args에서 파싱이 어려울 수 있음
      // 따라서 process.argv에서 직접 추출
      const runIndex = process.argv.indexOf('run')
      const allArgs = process.argv.slice(runIndex + 1)

      // 첫 두 개의 non-flag 인자 (agent, prompt)를 찾아서 제외
      const passthroughFlags: string[] = []
      let positionalCount = 0
      let i = 0

      while (i < allArgs.length) {
        const arg = allArgs[i]

        if (arg.startsWith('-')) {
          // 플래그: 패스스루에 추가
          passthroughFlags.push(arg)

          // 플래그가 값을 가지는지 확인 (다음 인자가 -로 시작하지 않으면)
          if (i + 1 < allArgs.length && !allArgs[i + 1].startsWith('-')) {
            // 이미 포지셔널 2개를 다 찾았으면 다음 것도 패스스루
            if (positionalCount >= 2) {
              passthroughFlags.push(allArgs[i + 1])
              i++
            }
          }
        } else {
          // 포지셔널 인자
          if (positionalCount < 2) {
            positionalCount++
          } else {
            // 3번째 이후 포지셔널은 패스스루
            passthroughFlags.push(arg)
          }
        }
        i++
      }

      try {
        const result = ctx.runService.run(agent, prompt, passthroughFlags)
        process.exitCode = result.exitCode
      } catch (err) {
        console.error((err as Error).message)
        process.exit(1)
      }
    })
}
