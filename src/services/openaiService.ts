import OpenAI from 'openai';
import { BibleVerse } from './bibleService';

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY não configurada');
    }
    
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateBibleResponse(
    verses: BibleVerse[],
    question?: string,
    webSearchResults?: string[]
  ): Promise<string> {
    const systemPrompt = `Você é um assistente especializado em análise bíblica. 
Sua função é ajudar a entender e comparar versões da Bíblia católica e protestante.
Você deve:
- Fornecer explicações claras e respeitosas sobre as diferenças entre versões
- Manter neutralidade e respeito por ambas as tradições
- Usar informações de busca na web quando relevante para contexto histórico ou teológico
- Explicar o significado dos versículos de forma educativa`;

    const versesText = verses
      .map(v => `**${v.book} ${v.chapter}:${v.verse} (${v.version})**: ${v.text}`)
      .join('\n\n');

    const webContext = webSearchResults && webSearchResults.length > 0
      ? `\n\n**Contexto adicional da web:**\n${webSearchResults.join('\n\n')}`
      : '';

    const userPrompt = question
      ? `${question}\n\n**Versículos consultados:**\n${versesText}${webContext}`
      : `Analise e explique os seguintes versículos bíblicos:\n\n${versesText}${webContext}`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0]?.message?.content || 'Não foi possível gerar uma resposta.';
    } catch (error: any) {
      if (error?.code === 'model_not_found' || error?.message?.includes('gpt-4')) {
        try {
          const completion = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          });
          return completion.choices[0]?.message?.content || 'Não foi possível gerar uma resposta.';
        } catch (fallbackError) {
          console.error('Erro ao gerar resposta do GPT (fallback):', fallbackError);
          throw fallbackError;
        }
      }
      console.error('Erro ao gerar resposta do GPT:', error);
      throw error;
    }
  }

  async compareBibleVersions(
    verses: Map<string, BibleVerse | null>,
    webSearchResults?: string[]
  ): Promise<string> {
    const systemPrompt = `Você é um especialista em comparação de versões bíblicas.
Compare as diferentes traduções fornecidas, destacando:
- Diferenças de tradução e suas possíveis razões
- Contexto histórico e teológico
- Significado teológico das variações
- Respeitando tanto a tradição católica quanto protestante`;

    const versesArray = Array.from(verses.entries())
      .filter(([_, verse]) => verse !== null)
      .map(([version, verse]) => `**${version.toUpperCase()}**: ${verse!.text}`)
      .join('\n\n');

    const webContext = webSearchResults && webSearchResults.length > 0
      ? `\n\n**Contexto adicional da web:**\n${webSearchResults.join('\n\n')}`
      : '';

    const userPrompt = `Compare as seguintes versões do mesmo versículo:\n\n${versesArray}${webContext}`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      return completion.choices[0]?.message?.content || 'Não foi possível gerar uma comparação.';
    } catch (error: any) {
      if (error?.code === 'model_not_found' || error?.message?.includes('gpt-4')) {
        try {
          const completion = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1500,
          });
          return completion.choices[0]?.message?.content || 'Não foi possível gerar uma comparação.';
        } catch (fallbackError) {
          console.error('Erro ao comparar versões (fallback):', fallbackError);
          throw fallbackError;
        }
      }
      console.error('Erro ao comparar versões:', error);
      throw error;
    }
  }
}

