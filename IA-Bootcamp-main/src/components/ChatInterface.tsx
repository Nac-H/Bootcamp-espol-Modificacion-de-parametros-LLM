import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatResponse {
  message: string
}

interface ChatParams {
  temperature?: number
  top_p?: number
  top_k?: number
}


function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max)
}
function toNumOrUndefined(v: string): number | undefined {
  if (v === '' || v === null || v === undefined) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}


async function sendMessage(message: string, params?: ChatParams): Promise<ChatResponse> {
  const cleaned: ChatParams = {}

  if (typeof params?.temperature === 'number') {
    cleaned.temperature = clamp(params.temperature, 0, 2)
  }


  if (typeof params?.top_p === 'number' && params?.top_k === undefined) {
    cleaned.top_p = clamp(params.top_p, 0, 1)
  } else if (typeof params?.top_k === 'number' && params?.top_p === undefined) {
    cleaned.top_k = clamp(params.top_k, 0, 20)
  }

  const payload: any = {
    input: message,
    messages: [{ role: 'user', content: message }],
  }
  if (Object.keys(cleaned).length > 0) payload.params = cleaned

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

  const [temperature, setTemperature] = useState<string>('0.7')
  const [topP, setTopP] = useState<string>('')   
  const [topK, setTopK] = useState<string>('')   

  const currentParams: ChatParams = (() => {
    const t = toNumOrUndefined(temperature)
    const p = toNumOrUndefined(topP)
    const k = toNumOrUndefined(topK)

    const out: ChatParams = {}
    if (t !== undefined) out.temperature = clamp(t, 0, 1)


    if (p !== undefined && k === undefined) out.top_p = clamp(p, 0, 1)
    else if (k !== undefined && p === undefined) out.top_k = clamp(k, 0, 20)

    return out
  })()

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
    }

    setMessages((prev) => [...prev, userMessage])
    chatMutation.mutate(inputValue)
    setInputValue('')
  }

  const clearChat = () => {
    setMessages([])
  }

  
  const topPDisabled = topK.trim() !== ''
  const topKDisabled = topP.trim() !== ''

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h1 className="text-xl font-semibold text-gray-800">
            Chat Assistant
          </h1>
        </div>
        <button
          onClick={clearChat}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1"
        >
          🗑️ Limpiar
        </button>
      </div>

      {/* Panel de Configuración */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

       
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">
              Temperature <span className="text-gray-400">(0 – 1)</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min={0}
              max={1}
              value={temperature}
              onChange={(e) => {
                const v = e.target.value
               
                if (v === '') return setTemperature('')
                const n = Number(v)
                if (!Number.isFinite(n)) return
                setTemperature(String(clamp(n, 0, 2)))
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.7"
            />
          </div>

          {/* Top-p [0,1] */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">
              Top-p <span className="text-gray-400">(0 – 1)</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              max={1}
              value={topP}
              onChange={(e) => {
                const v = e.target.value
                if (v === '') return setTopP('')
                const n = Number(v)
                if (!Number.isFinite(n)) return
                setTopP(String(clamp(n, 0, 1)))
              }}
              disabled={topPDisabled}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                topPDisabled ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
              }`}
              placeholder="0.9"
              title={topPDisabled ? 'Deshabilitado porque top-k tiene un valor' : ''}
            />
            {topPDisabled && (
              <span className="text-[11px] text-gray-500 mt-1">
                Deshabilitado porque <strong>top-k</strong> está definido.
              </span>
            )}
          </div>

          {/* Top-k [0,20] */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">
              Top-k <span className="text-gray-400">(0 – 20)</span>
            </label>
            <input
              type="number"
              inputMode="numeric"
              step="1"
              min={0}
              max={20}
              value={topK}
              onChange={(e) => {
                const v = e.target.value
                if (v === '') return setTopK('')
                const n = Number(v)
                if (!Number.isFinite(n)) return
                setTopK(String(clamp(n, 0, 20)))
              }}
              disabled={topKDisabled}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                topKDisabled ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
              }`}
              placeholder="10"
              title={topKDisabled ? 'Deshabilitado porque top-p tiene un valor' : ''}
            />
            {topKDisabled && (
              <span className="text-[11px] text-gray-500 mt-1">
                Deshabilitado porque <strong>top-p</strong> está definido.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <span className="text-4xl block mb-2">💬</span>
            <p>¡Hola! Escribe un mensaje para comenzar.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start gap-2 max-w-xs md:max-w-md lg:max-w-lg">
                {!message.isUser && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    🤖
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    👤
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                🤖
              </div>
              <div className="bg-white border border-gray-200 rounded-lg rounded-bl-sm px-4 py-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">Escribiendo</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={chatMutation.isPending}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || chatMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <span>📤</span>
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}
