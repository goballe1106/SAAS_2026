import { config } from '../config/openrouter'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function chatWithAI(messages: ChatMessage[], systemPrompt?: string): Promise<string> {
  try {
    const allMessages = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      ...messages
    ]

    const response = await fetch(`${config.openrouter.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openrouter.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://192.168.1.43:3001',
        'X-Title': 'ERP SAS'
      },
      body: JSON.stringify({
        model: config.openrouter.defaultModel,
        messages: allMessages,
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenRouter error:', error)
      return 'Error al comunicarse con la IA'
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'Sin respuesta'
  } catch (error) {
    console.error('AI service error:', error)
    return 'Error de conexión con la IA'
  }
}

export async function generateText(prompt: string): Promise<string> {
  return chatWithAI([{ role: 'user', content: prompt }])
}

export async function summarizeText(text: string): Promise<string> {
  return chatWithAI(
    [{ role: 'user', content: `Resume este texto de forma clara y concisa:\n\n${text}` }],
    'Eres un asistente que resume textos de forma clara y profesional.'
  )
}

export async function generateDescription(itemType: string, data: any): Promise<string> {
  return chatWithAI(
    [{ role: 'user', content: `Genera una descripción profesional para un/una ${itemType} con estos datos: ${JSON.stringify(data)}` }],
    'Eres un asistente que genera descripciones profesionales y concisas.'
  )
}
