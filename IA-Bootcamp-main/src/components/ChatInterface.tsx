import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
   params?: ChatParams 
}

interface ChatResponse {
  message: string
}

interface ChatParams {
  temperature?: number
  top_p?: number
  top_k?: number
  reasoning_effort?: 'high' | 'medium' | 'low' | 'minimal'
}

type ReasoningEffort = 'high' | 'medium' | 'low' | 'minimal'

interface ChatParamsState {
  temperature: string
  topP: string
  topK: string
  reasoningEffort: ReasoningEffort
}

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max)
}
function toNumOrUndefined(v: string): number | undefined {
  if (v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

async function sendMessage(message: string, params: ChatParams): Promise<ChatResponse> {
  const payload = {
    input: message,
    messages: [{ role: 'user', content: message }],
    params: {
      temperature: params.temperature,
      top_p: params.top_p,
      top_k: params.top_k,
      reasoning_effort: params.reasoning_effort,
    },
  }

  const response = await fetch('http://localhost:3000/api/completion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const text = await response.text()

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${text}`)
  }

  try {
    const data = JSON.parse(text)
    return { message: data.message || data.content || 'Sin respuesta' }
  } catch {
    return { message: text || 'Sin respuesta' }
  }
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Array<Message>>([])
  const [inputValue, setInputValue] = useState('')

  // 🔹 Un solo estado para todos los parámetros
  const [params, setParams] = useState<ChatParamsState>({
    temperature: '0.7',
    topP: '',
    topK: '',
    reasoningEffort: 'medium',
  })

  // Transformamos params para el backend
  const currentParams: ChatParams = {
    temperature: toNumOrUndefined(params.temperature),
    reasoning_effort: params.reasoningEffort,
  }
  if (params.topP && !params.topK) currentParams.top_p = clamp(Number(params.topP), 0, 1)
  if (params.topK && !params.topP) currentParams.top_k = clamp(Number(params.topK), 0, 20)

  const chatMutation = useMutation({
    mutationFn: (msg: string) => sendMessage(msg, currentParams),
    retry: false,
    onSuccess: (data) => {
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        content: data.message,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    },
    onError: (error: any) => {
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: `❌ Error: ${error.message}`,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || chatMutation.isPending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
      params: currentParams,
    }

    setMessages((prev) => [...prev, userMessage])
    chatMutation.mutate(inputValue)
    setInputValue('')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          🤖 Chat Assistant
        </h1>
        <button
          onClick={() => setMessages([])}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          🗑️ Limpiar
        </button>
      </div>

      {/* Configuración */}
      <div className="bg-white border-b border-gray-200 p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-gray-600">Temperature (0-1)</label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.1}
            value={params.temperature}
            onChange={(e) =>
              setParams((prev) => ({ ...prev, temperature: e.target.value }))
            }
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Top-p (0-1)</label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={params.topP}
            onChange={(e) =>
              setParams((prev) => ({ ...prev, topP: e.target.value }))
            }
            disabled={!!params.topK}
            className="w-full px-2 py-1 border rounded disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Top-k (0-20)</label>
          <input
            type="number"
            min={0}
            max={20}
            step={1}
            value={params.topK}
            onChange={(e) =>
              setParams((prev) => ({ ...prev, topK: e.target.value }))
            }
            disabled={!!params.topP}
            className="w-full px-2 py-1 border rounded disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Reasoning Effort</label>
          <select
            value={params.reasoningEffort}
            onChange={(e) =>
              setParams((prev) => ({
                ...prev,
                reasoningEffort: e.target.value as ReasoningEffort,
              }))
            }
            className="w-full px-2 py-1 border rounded"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 text-gray-400">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="text-sm text-gray-500">🤖 Escribiendo...</div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={chatMutation.isPending}
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || chatMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}
