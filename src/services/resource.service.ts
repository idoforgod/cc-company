import type { IStore } from '../store/store.js'
import type { SubagentConfig, SkillConfig, HookConfig } from '../types/index.js'

export class ResourceService {
  constructor(private store: IStore) {}

  // Subagents
  createSubagent(name: string, description: string, prompt: string): void {
    this.store.createSubagent({ name, description, prompt })
  }

  listSubagents(): SubagentConfig[] {
    return this.store.listSubagents()
  }

  removeSubagent(name: string): void {
    // 할당된 agent가 있는지 확인
    const agents = this.store.listAgents()
    const assignedAgents = agents.filter((agent) =>
      agent.subagents?.includes(name)
    )

    if (assignedAgents.length > 0) {
      const agentNames = assignedAgents.map((a) => a.name).join(', ')
      console.warn(
        `Warning: Subagent '${name}' is assigned to agents: ${agentNames}. Removing anyway.`
      )
    }

    this.store.removeSubagent(name)
  }

  // Skills
  createSkill(name: string, description: string, prompt: string): void {
    this.store.createSkill({ name, description, prompt })
  }

  listSkills(): SkillConfig[] {
    return this.store.listSkills()
  }

  removeSkill(name: string): void {
    // 할당된 agent가 있는지 확인
    const agents = this.store.listAgents()
    const assignedAgents = agents.filter((agent) =>
      agent.skills?.includes(name)
    )

    if (assignedAgents.length > 0) {
      const agentNames = assignedAgents.map((a) => a.name).join(', ')
      console.warn(
        `Warning: Skill '${name}' is assigned to agents: ${agentNames}. Removing anyway.`
      )
    }

    this.store.removeSkill(name)
  }

  // Hooks
  createHook(name: string, description: string, config: Record<string, unknown>): void {
    this.store.createHook({ name, description, config })
  }

  listHooks(): HookConfig[] {
    return this.store.listHooks()
  }

  removeHook(name: string): void {
    // 할당된 agent가 있는지 확인
    const agents = this.store.listAgents()
    const assignedAgents = agents.filter((agent) =>
      agent.hooks?.includes(name)
    )

    if (assignedAgents.length > 0) {
      const agentNames = assignedAgents.map((a) => a.name).join(', ')
      console.warn(
        `Warning: Hook '${name}' is assigned to agents: ${agentNames}. Removing anyway.`
      )
    }

    this.store.removeHook(name)
  }
}
