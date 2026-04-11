import { create } from 'zustand'
import type { AgentStreamChunk } from '../types/electron'

interface ConversationRuntimeState {
  draft: string
  chunks: AgentStreamChunk[]
  running: boolean
  updatedAt: number
}

interface AiRuntimeStoreState {
  activeRunId: string
  states: Record<string, ConversationRuntimeState>
  startRun: (conversationId: string, runId: string) => void
  appendChunk: (conversationId: string, chunk: AgentStreamChunk) => void
  finishRun: (conversationId: string) => void
  clearConversation: (conversationId: string) => void
}

function nextConversationState(previous?: ConversationRuntimeState): ConversationRuntimeState {
  return previous || {
    draft: '',
    chunks: [],
    running: false,
    updatedAt: Date.now()
  }
}

export const useAiRuntimeStore = create<AiRuntimeStoreState>((set) => ({
  activeRunId: '',
  states: {},
  startRun: (conversationId, runId) => set((state) => {
    const prev = nextConversationState(state.states[conversationId])
    return {
      activeRunId: runId,
      states: {
        ...state.states,
        [conversationId]: {
          ...prev,
          draft: '',
          chunks: [],
          running: true,
          updatedAt: Date.now()
        }
      }
    }
  }),
  appendChunk: (conversationId, chunk) => set((state) => {
    const prev = nextConversationState(state.states[conversationId])
    const nextDraft = chunk.type === 'content'
      ? `${prev.draft}${chunk.content || ''}`
      : prev.draft
    return {
      states: {
        ...state.states,
        [conversationId]: {
          ...prev,
          draft: nextDraft,
          chunks: [...prev.chunks, chunk].slice(-300),
          updatedAt: Date.now(),
          running: chunk.type === 'done' || chunk.isFinished ? false : prev.running
        }
      }
    }
  }),
  finishRun: (conversationId) => set((state) => {
    const prev = state.states[conversationId]
    if (!prev) return state
    return {
      activeRunId: '',
      states: {
        ...state.states,
        [conversationId]: {
          ...prev,
          draft: '',
          running: false,
          updatedAt: Date.now()
        }
      }
    }
  }),
  clearConversation: (conversationId) => set((state) => {
    const next = { ...state.states }
    delete next[conversationId]
    return { states: next }
  })
}))
