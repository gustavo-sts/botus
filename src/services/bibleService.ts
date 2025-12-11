import axios from 'axios';

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
}

export class BibleService {
  private readonly apiUrl = 'https://bible-api.com';

  private normalizeBookName(book: string): string {
    const bookMap: Record<string, string> = {
      'genesis': 'genesis',
      'gen': 'genesis',
      'exodo': 'exodus',
      'ex': 'exodus',
      'levitico': 'leviticus',
      'lv': 'leviticus',
      'numeros': 'numbers',
      'nm': 'numbers',
      'deuteronomio': 'deuteronomy',
      'dt': 'deuteronomy',
      'jo': 'john',
      'mateus': 'matthew',
      'mt': 'matthew',
      'marcos': 'mark',
      'mc': 'mark',
      'lucas': 'luke',
      'lc': 'luke',
      'atos': 'acts',
      'romanos': 'romans',
      'rm': 'romans',
      'corintios': 'corinthians',
      'cor': 'corinthians',
      'galatas': 'galatians',
      'gl': 'galatians',
      'efesios': 'ephesians',
      'ef': 'ephesians',
      'filipenses': 'philippians',
      'fp': 'philippians',
      'colossenses': 'colossians',
      'cl': 'colossians',
      'tessalonicenses': 'thessalonians',
      'ts': 'thessalonians',
      'timoteo': 'timothy',
      'tm': 'timothy',
      'tito': 'titus',
      'filemom': 'philemon',
      'hebreus': 'hebrews',
      'hb': 'hebrews',
      'tiago': 'james',
      'pedro': 'peter',
      'joao': 'john',
      'judas': 'jude',
      'apocalipse': 'revelation',
      'ap': 'revelation',
    };

    const normalized = book.toLowerCase().trim();
    return bookMap[normalized] || normalized;
  }

  async getVerse(book: string, chapter: number, verse: number, version: string = 'acf'): Promise<BibleVerse | null> {
    try {
      const normalizedBook = this.normalizeBookName(book);
      const reference = `${normalizedBook} ${chapter}:${verse}`;
      const url = `${this.apiUrl}/${reference}?translation=${version}`;
      
      const response = await axios.get(url, {
        timeout: 10000,
      });
      
      if (response.data && response.data.verses && response.data.verses.length > 0) {
        const verseData = response.data.verses[0];
        return {
          book: response.data.reference || book,
          chapter,
          verse,
          text: verseData.text,
          version: version.toUpperCase(),
        };
      }
      
      return null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error(`Versículo não encontrado: ${book} ${chapter}:${verse}`);
      } else {
        console.error('Erro ao buscar versículo:', error.message);
      }
      return null;
    }
  }

  async getChapter(book: string, chapter: number, version: string = 'acf'): Promise<BibleVerse[] | null> {
    try {
      const normalizedBook = this.normalizeBookName(book);
      const reference = `${normalizedBook} ${chapter}`;
      const url = `${this.apiUrl}/${reference}?translation=${version}`;
      
      const response = await axios.get(url, {
        timeout: 10000,
      });
      
      if (response.data && response.data.verses) {
        return response.data.verses.map((verse: any) => ({
          book: response.data.reference || book,
          chapter,
          verse: verse.verse,
          text: verse.text,
          version: version.toUpperCase(),
        }));
      }
      
      return null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error(`Capítulo não encontrado: ${book} ${chapter}`);
      } else {
        console.error('Erro ao buscar capítulo:', error.message);
      }
      return null;
    }
  }

  async compareVersions(
    book: string,
    chapter: number,
    verse: number,
    versions: string[] = ['acf', 'kjv', 'nvi']
  ): Promise<Map<string, BibleVerse | null>> {
    const results = new Map<string, BibleVerse | null>();
    
    for (const version of versions) {
      const verseData = await this.getVerse(book, chapter, verse, version);
      results.set(version, verseData);
    }
    
    return results;
  }

  getCatholicVersions(): string[] {
    return ['nvi', 'nvt', 'acf'];
  }

  getProtestantVersions(): string[] {
    return ['kjv', 'asv', 'niv', 'nvi'];
  }
}

