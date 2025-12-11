# Guia de Configuração - BOTus

## Passo a Passo para Configurar o Bot

### 1. Criar Aplicação no Discord

1. Acesse https://discord.com/developers/applications
2. Clique em "New Application"
3. Dê um nome para sua aplicação (ex: "BOTus")
4. Clique em "Create"

### 2. Configurar o Bot

1. No menu lateral, clique em "Bot"
2. Clique em "Add Bot" e confirme
3. Em "Token", clique em "Reset Token" e copie o token (este é o `DISCORD_TOKEN`)
4. Em "Privileged Gateway Intents", ative:
   - ✅ MESSAGE CONTENT INTENT (necessário para ler mensagens)
5. No menu lateral, clique em "OAuth2" > "URL Generator"
6. Em "Scopes", selecione:
   - ✅ bot
   - ✅ applications.commands
7. Em "Bot Permissions", selecione:
   - ✅ Send Messages
   - ✅ Use Slash Commands
   - ✅ Read Message History
   - ✅ Embed Links
8. Copie a URL gerada e abra no navegador para adicionar o bot ao seu servidor
9. No menu "General Information", copie o "Application ID" (este é o `DISCORD_CLIENT_ID`)

### 3. Obter Chave da OpenAI

1. Acesse https://platform.openai.com/api-keys
2. Faça login ou crie uma conta
3. Clique em "Create new secret key"
4. Dê um nome para a chave e copie (este é o `OPENAI_API_KEY`)
5. **Importante**: Guarde a chave, pois ela só será mostrada uma vez

### 4. Obter Chave da Brave (Opcional)

1. Acesse https://brave.com/search/api/
2. Crie uma conta ou faça login
3. Obtenha sua chave de API (este é o `BRAVE_API_KEY`)
4. **Nota**: Se não fornecer esta chave, o bot usará busca alternativa

### 5. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto:
```
DISCORD_TOKEN=seu_token_aqui
OPENAI_API_KEY=sua_chave_openai_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui
BRAVE_API_KEY=sua_chave_brave_aqui
```

### 6. Instalar Dependências

```powershell
pnpm install
```

### 7. Registrar Comandos

```powershell
pnpm run register
```

Você deve ver a mensagem: "Comandos registrados com sucesso!"

### 8. Compilar o Projeto

```powershell
pnpm run build
```

### 9. Executar o Bot

```powershell
pnpm start
```

Você deve ver: "Bot conectado como [Nome do Bot]#[Tag]"

## Solução de Problemas

### Bot não responde aos comandos

- Verifique se executou `pnpm run register`
- Verifique se o bot está online no servidor
- Verifique se o bot tem permissões no canal

### Erro ao buscar versículos

- Verifique sua conexão com a internet
- A API bible-api.com pode estar temporariamente indisponível

### Erro ao gerar resposta com IA

- Verifique se a `OPENAI_API_KEY` está correta
- Verifique se você tem créditos na conta OpenAI
- O bot tentará usar GPT-3.5-turbo se GPT-4 não estiver disponível

### Erro na busca web

- Se você não forneceu `BRAVE_API_KEY`, o bot usará busca alternativa
- A busca alternativa pode ter resultados limitados

## Comandos de Desenvolvimento

- `pnpm run dev` - Executa o bot em modo desenvolvimento (com ts-node)
- `pnpm run watch` - Compila o TypeScript em modo watch
- `pnpm run build` - Compila o projeto para produção
- `pnpm run register` - Registra comandos no Discord
- `pnpm start` - Executa o bot compilado

## Notas Importantes

- O bot precisa estar online para responder comandos
- Comandos são globais e podem levar até 1 hora para aparecer em todos os servidores
- Para desenvolvimento, você pode registrar comandos apenas em um servidor de teste usando `Routes.applicationGuildCommands(clientId, guildId)`

