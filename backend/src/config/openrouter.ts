export const config = {
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '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',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'anthropic/claude-3-haiku',
  }
}
