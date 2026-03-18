import { Command } from 'commander'
import { createContext } from './context.js'

export function registerSkillCommand(program: Command): void {
  const skillCmd = program
    .command('skill')
    .description('Manage shared skills')

  // cc-company skill add <name>
  skillCmd
    .command('add <name>')
    .description('Add a new skill to the shared pool')
    .option('-d, --description <description>', 'Skill description', '')
    .option('-p, --prompt <prompt>', 'Skill prompt', '')
    .action((name: string, options: { description: string; prompt: string }) => {
      const ctx = createContext()
      try {
        ctx.resourceService.createSkill(name, options.description, options.prompt)
        console.log(`Skill '${name}' created.`)
      } catch (err) {
        console.error((err as Error).message)
        process.exit(1)
      }
    })

  // cc-company skill list
  skillCmd
    .command('list')
    .description('List all shared skills')
    .action(() => {
      const ctx = createContext()
      const skills = ctx.resourceService.listSkills()

      if (skills.length === 0) {
        console.log('No skills found.')
        return
      }

      for (const skill of skills) {
        const desc = skill.description || '(no description)'
        console.log(`${skill.name.padEnd(16)} ${desc}`)
      }
    })

  // cc-company skill remove <name>
  skillCmd
    .command('remove <name>')
    .description('Remove a skill from the shared pool')
    .action((name: string) => {
      const ctx = createContext()
      try {
        ctx.resourceService.removeSkill(name)
        console.log(`Skill '${name}' removed.`)
      } catch (err) {
        console.error((err as Error).message)
        process.exit(1)
      }
    })
}
