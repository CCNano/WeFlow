import type { AgentStreamChunk } from './electron'

export type AiToolCategory = 'core' | 'analysis'

export interface AiConversation {
  conversationId: string
  title: string
  createdAt: number
  updatedAt: number
  lastMessageAt: number
}

export interface AiMessageRecord {
  messageId: string
  conversationId: string
  role: 'user' | 'assistant' | 'system' | 'tool' | string
  content: string
  intentType: string
  components: any[]
  toolTrace: any[]
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
  error?: string
  parentMessageId?: string
  createdAt: number
}

export interface ToolCatalogEntry {
  name: string
  category: AiToolCategory
  description: string
  parameters: Record<string, unknown>
}

export interface AssistantSummary {
  id: string
  name: string
  systemPrompt: string
  presetQuestions: string[]
  allowedBuiltinTools?: string[]
  builtinId?: string
  applicableChatTypes?: Array<'group' | 'private'>
  supportedLocales?: string[]
}

export interface SkillSummary {
  id: string
  name: string
  description: string
  tags: string[]
  chatScope: 'all' | 'group' | 'private'
  tools: string[]
  builtinId?: string
}

export interface SqlSchemaTable {
  name: string
  columns: string[]
}

export interface SqlSchemaSource {
  kind: 'message' | 'contact' | 'biz'
  path: string | null
  label: string
  tables: SqlSchemaTable[]
}

export interface SqlSchemaPayload {
  generatedAt: number
  sources: SqlSchemaSource[]
}

export interface SqlResultPayload {
  rows: Record<string, unknown>[]
  columns: string[]
  total: number
}

export interface ConversationRuntimeView {
  draft: string
  chunks: AgentStreamChunk[]
  running: boolean
  updatedAt: number
}

