import { FastifyInstance } from 'fastify'
import { chatWithAI, generateText, summarizeText } from '../services/ai.service'

export async function aiRoutes(fastify: FastifyInstance) {
  
  // Chat con IA
  fastify.post('/ai/chat', async (request, reply) => {
    try {
      const { messages, systemPrompt } = request.body as {
        messages: { role: 'user' | 'assistant', content: string }[]
        systemPrompt?: string
      }

      if (!messages || !Array.isArray(messages)) {
        return reply.status(400).send({ error: 'Se requiere un array de mensajes' })
      }

      const response = await chatWithAI(messages, systemPrompt)
      return { response }
    } catch (error) {
      console.error('AI chat error:', error)
      return reply.status(500).send({ error: 'Error al procesar solicitud' })
    }
  })

  // Generar texto
  fastify.post('/ai/generate', async (request, reply) => {
    try {
      const { prompt } = request.body as { prompt: string }

      if (!prompt) {
        return reply.status(400).send({ error: 'Se requiere un prompt' })
      }

      const response = await generateText(prompt)
      return { response }
    } catch (error) {
      console.error('AI generate error:', error)
      return reply.status(500).send({ error: 'Error al generar texto' })
    }
  })

  // Resumir texto
  fastify.post('/ai/summarize', async (request, reply) => {
    try {
      const { text } = request.body as { text: string }

      if (!text) {
        return reply.status(400).send({ error: 'Se requiere un texto para resumir' })
      }

      const summary = await summarizeText(text)
      return { summary }
    } catch (error) {
      console.error('AI summarize error:', error)
      return reply.status(500).send({ error: 'Error al resumir texto' })
    }
  })
}
