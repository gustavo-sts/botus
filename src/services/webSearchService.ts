import axios from 'axios';

export class WebSearchService {
  async search(query: string, maxResults: number = 3): Promise<string[]> {
    if (process.env.BRAVE_API_KEY) {
      try {
        return await this.braveSearch(query, maxResults);
      } catch (error) {
        console.error('Erro na busca web (Brave API):', error);
      }
    }
    
    try {
      return await this.duckDuckGoSearch(query, maxResults);
    } catch (error) {
      console.error('Erro na busca DuckDuckGo:', error);
      return [];
    }
  }

  private async braveSearch(query: string, maxResults: number): Promise<string[]> {
    const searchUrl = `https://api.search.brave.com/v1/web/search`;
    
    const response = await axios.get(searchUrl, {
      params: {
        q: query,
        count: maxResults,
      },
      headers: {
        'X-Subscription-Token': process.env.BRAVE_API_KEY!,
      },
    });

    if (response.data && response.data.web && response.data.web.results) {
      return response.data.web.results.map((result: any) => 
        `**${result.title}**\n${result.description}\n${result.url}`
      );
    }

    return [];
  }

  private async duckDuckGoSearch(query: string, maxResults: number): Promise<string[]> {
    const searchUrl = `https://html.duckduckgo.com/html/`;
    
    try {
      const response = await axios.get(searchUrl, {
        params: {
          q: query,
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const results: string[] = [];
      const html = response.data;
      
      const titleRegex = /<a class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
      const snippetRegex = /<a class="result__snippet"[^>]*>([^<]*)<\/a>/g;
      
      let match;
      let count = 0;
      
      while ((match = titleRegex.exec(html)) !== null && count < maxResults) {
        const url = match[1];
        const title = match[2].replace(/<[^>]*>/g, '').trim();
        
        const snippetMatch = snippetRegex.exec(html);
        const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, '').trim() : '';
        
        if (title && url) {
          results.push(`**${title}**\n${snippet}\n${url}`);
          count++;
        }
      }
      
      return results;
    } catch (error) {
      return this.simpleSearch(query, maxResults);
    }
  }

  private async simpleSearch(query: string, maxResults: number): Promise<string[]> {
    const results: string[] = [];
    
    const searchTerms = query.toLowerCase();
    const bibleTerms = ['bíblia', 'bible', 'versículo', 'verse', 'capítulo', 'chapter'];
    const hasBibleContext = bibleTerms.some(term => searchTerms.includes(term));
    
    if (hasBibleContext) {
      results.push(`**Contexto Bíblico**: Informações sobre "${query}" podem ser encontradas em comentários bíblicos e estudos teológicos.`);
      results.push(`**Sugestão**: Consulte comentários bíblicos confiáveis para análise detalhada do texto.`);
    } else {
      results.push(`**Busca**: "${query}" - Consulte fontes confiáveis para mais informações.`);
    }
    
    return results.slice(0, maxResults);
  }

  async searchBibleContext(book: string, chapter: number, verse?: number): Promise<string[]> {
    const query = verse 
      ? `${book} ${chapter} ${verse} bíblia contexto histórico teológico`
      : `${book} ${chapter} bíblia contexto histórico teológico`;
    
    return this.search(query, 3);
  }
}

