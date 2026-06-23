import Anthropic from '@anthropic-ai/sdk'
import type { ContentBlock } from '@anthropic-ai/sdk/resources/messages/messages'
import { getAnthropicApiKey } from '@/lib/ia-config'

export function createAnthropicClient(): Anthropic {
  const apiKey = getAnthropicApiKey()
  if (!apiKey) {
    throw new Error('Clé API Anthropic non configurée (ANTHROPIC_API_KEY).')
  }
  return new Anthropic({ apiKey })
}

export function extractAnthropicText(content: ContentBlock[]): string {
  return content
    .filter((block): block is Extract<ContentBlock, { type: 'text' }> => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim()
}
