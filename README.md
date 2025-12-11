# BOTus - Bot Discord para Análise Bíblica com IA

Bot Discord que permite ler e comparar versões católicas e protestantes da Bíblia, gerando respostas inteligentes usando GPT e buscando informações adicionais na web.

## Funcionalidades

- **Busca de Versículos**: Busque versículos específicos em diferentes versões da Bíblia
- **Comparação de Versões**: Compare o mesmo versículo entre versões católicas e protestantes
- **Análise com IA**: Receba explicações e análises geradas por GPT sobre os versículos
- **Busca na Web**: Busque contexto adicional na web sobre tópicos bíblicos
- **Leitura de Capítulos**: Leia capítulos completos da Bíblia

## Instalação

## Documentação

- **[SETUP.md](./SETUP.md)** - Guia completo de configuração inicial
- **[HOSPEDAGEM.md](./HOSPEDAGEM.md)** - Guia detalhado de hospedagem
- **[DEPLOY_RAPIDO.md](./DEPLOY_RAPIDO.md)** - Guia rápido de deploy (recomendado para iniciantes)

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd BOTus
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com:
```
DISCORD_TOKEN=seu_token_do_discord
OPENAI_API_KEY=sua_chave_openai
DISCORD_CLIENT_ID=seu_client_id
BRAVE_API_KEY=sua_chave_brave_opcional
```

4. Registre os comandos no Discord:
```bash
pnpm run register
```

5. Compile o projeto:
```bash
pnpm run build
```

6. Execute o bot:
```bash
pnpm start
```

Para desenvolvimento com hot-reload:
```bash
pnpm run dev
```

**Importante**: Execute `pnpm run register` sempre que adicionar ou modificar comandos.

## Como Obter as Chaves

### Discord Token
1. Acesse https://discord.com/developers/applications
2. Crie uma nova aplicação
3. Vá em "Bot" e crie um bot
4. Copie o token

### OpenAI API Key
1. Acesse https://platform.openai.com/api-keys
2. Crie uma nova chave de API
3. Copie a chave

### Brave API Key (Opcional)
1. Acesse https://brave.com/search/api/
2. Crie uma conta e obtenha sua chave
3. Se não fornecer, o bot usará busca alternativa (DuckDuckGo)

## Comandos

### `/versiculo`
Busca um versículo específico e gera explicação com IA.

**Parâmetros:**
- `livro`: Nome do livro (ex: João, Gênesis)
- `capitulo`: Número do capítulo
- `versiculo`: Número do versículo
- `versao`: Versão da Bíblia (opcional, padrão: acf)
- `pergunta`: Pergunta opcional sobre o versículo
- `buscar_web`: Buscar contexto adicional na web (opcional)

**Exemplo:**
```
/versiculo livro:João capitulo:3 versiculo:16 versao:nvi pergunta:Qual é o significado deste versículo?
```

### `/comparar`
Compara um versículo entre versões católicas e protestantes.

**Parâmetros:**
- `livro`: Nome do livro
- `capitulo`: Número do capítulo
- `versiculo`: Número do versículo
- `buscar_web`: Buscar contexto adicional na web (opcional)

**Exemplo:**
```
/comparar livro:João capitulo:3 versiculo:16 buscar_web:true
```

### `/capitulo`
Busca um capítulo completo da Bíblia.

**Parâmetros:**
- `livro`: Nome do livro
- `capitulo`: Número do capítulo
- `versao`: Versão da Bíblia (opcional)
- `buscar_web`: Buscar contexto adicional na web (opcional)

**Exemplo:**
```
/capitulo livro:João capitulo:3 versao:nvi
```

### `/buscar`
Busca informações na web sobre um tópico bíblico.

**Parâmetros:**
- `query`: Termo de busca
- `resultados`: Número de resultados (1-5, opcional, padrão: 3)

**Exemplo:**
```
/buscar query:significado da ressurreição de Jesus resultados:5
```

## Versões da Bíblia Suportadas

- **ACF**: Almeida Corrigida Fiel
- **KJV**: King James Version
- **NVI**: Nova Versão Internacional
- **ASV**: American Standard Version
- **NIV**: New International Version
- E outras disponíveis na API bible-api.com

## Estrutura do Projeto

```
BOTus/
├── src/
│   ├── commands/          # Comandos do bot
│   ├── events/            # Eventos do Discord
│   ├── services/          # Serviços (Bíblia, OpenAI, Web Search)
│   ├── types/             # Tipos TypeScript
│   └── index.ts           # Arquivo principal
├── dist/                  # Código compilado
├── package.json
├── tsconfig.json
└── README.md
```

## Tecnologias Utilizadas

- **Discord.js**: Biblioteca para interação com Discord
- **OpenAI**: API do GPT para geração de respostas
- **TypeScript**: Linguagem de programação
- **Axios**: Cliente HTTP
- **Bible API**: API para busca de versículos bíblicos

## Notas

- O bot requer permissões para ler mensagens e responder comandos
- Certifique-se de que o bot tenha as intents necessárias configuradas no Discord Developer Portal
- A API do OpenAI tem custos associados ao uso
- A busca na web usa Brave API (se disponível) ou DuckDuckGo como fallback

## Licença

MIT

