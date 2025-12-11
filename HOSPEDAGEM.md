# Guia de Hospedagem - BOTus

Este guia explica como hospedar seu bot Discord em diferentes plataformas.

## Opções de Hospedagem

### 1. Railway (Recomendado - Gratuito com Limites)

**Vantagens:**
- Plano gratuito disponível ($5 de crédito mensal)
- Deploy automático via GitHub
- Fácil configuração
- Suporte a variáveis de ambiente

**Passos:**

1. Acesse https://railway.app
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Conecte seu repositório
6. Railway detectará automaticamente o projeto Node.js
7. Configure as variáveis de ambiente:
   - `DISCORD_TOKEN`
   - `OPENAI_API_KEY`
   - `DISCORD_CLIENT_ID`
   - `BRAVE_API_KEY` (opcional)
8. Adicione o comando de build:
   - Build Command: `pnpm install && pnpm run build`
   - Start Command: `pnpm start`
9. O bot será implantado automaticamente

**Nota:** Após o deploy, execute `pnpm run register` localmente ou crie um script de deploy.

---

### 2. Render (Gratuito com Limites)

**Vantagens:**
- Plano gratuito disponível
- Deploy automático via GitHub
- Fácil configuração

**Passos:**

1. Acesse https://render.com
2. Faça login com GitHub
3. Clique em "New +" > "Web Service"
4. Conecte seu repositório
5. Configure:
   - **Name:** botus (ou qualquer nome)
   - **Environment:** Node
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `pnpm start`
6. Adicione as variáveis de ambiente na seção "Environment"
7. Clique em "Create Web Service"

**Importante:** Render suspende serviços gratuitos após 15 minutos de inatividade. Para bots Discord, considere usar um "Background Worker" em vez de "Web Service".

---

### 3. Heroku (Pago após Novembro 2022)

**Vantagens:**
- Confiável e estável
- Boa documentação

**Desvantagens:**
- Não oferece mais plano gratuito
- Requer cartão de crédito para planos pagos

**Passos (se optar por Heroku):**

1. Instale o Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Faça login: `heroku login`
3. Crie um app: `heroku create botus`
4. Configure variáveis de ambiente:
```powershell
heroku config:set DISCORD_TOKEN=seu_token
heroku config:set OPENAI_API_KEY=sua_chave
heroku config:set DISCORD_CLIENT_ID=seu_client_id
heroku config:set BRAVE_API_KEY=sua_chave_brave
```
5. Adicione um arquivo `Procfile` na raiz:
```
worker: node dist/index.js
```
6. Deploy: `git push heroku main`

---

### 4. VPS (DigitalOcean, AWS, Linode, etc.)

**Vantagens:**
- Controle total
- Sem limitações de tempo de execução
- Mais barato a longo prazo

**Desvantagens:**
- Requer conhecimento de Linux
- Você é responsável pela manutenção

**Passos para DigitalOcean (Exemplo):**

1. Crie uma conta em https://www.digitalocean.com
2. Crie um Droplet (Ubuntu 22.04 LTS, mínimo $4/mês)
3. Conecte via SSH:
```powershell
ssh root@seu_ip
```
4. Instale Node.js e pnpm:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm
```
5. Instale Git:
```bash
sudo apt-get install git
```
6. Clone seu repositório:
```bash
git clone seu_repositorio
cd BOTus
```
7. Configure variáveis de ambiente:
```bash
nano .env
# Cole suas variáveis
```
8. Instale dependências e compile:
```bash
pnpm install
pnpm run build
pnpm run register
```
9. Use PM2 para manter o bot rodando:
```bash
npm install -g pm2
pm2 start dist/index.js --name botus
pm2 save
pm2 startup
```

---

### 5. Servidor Próprio (Windows/Linux)

**Vantagens:**
- Controle total
- Sem custos de hospedagem

**Desvantagens:**
- Requer computador sempre ligado
- Você é responsável pela manutenção

**Passos para Windows:**

1. Instale Node.js: https://nodejs.org
2. Instale pnpm globalmente:
```powershell
npm install -g pnpm
```
3. Clone ou copie o projeto
4. Configure o arquivo `.env`
5. Instale dependências:
```powershell
pnpm install
```
6. Compile e registre comandos:
```powershell
pnpm run build
pnpm run register
```
7. Execute o bot:
```powershell
pnpm start
```

**Para manter rodando 24/7:**
- Use o Agendador de Tarefas do Windows para iniciar o bot na inicialização
- Ou use PM2 para Windows: `npm install -g pm2-windows-startup`

---

## Recomendações por Caso de Uso

### Para Testes e Desenvolvimento
- **Railway** ou **Render** (gratuito, fácil de configurar)

### Para Produção com Baixo Tráfego
- **Railway** (plano pago) ou **VPS DigitalOcean** ($4-6/mês)

### Para Produção com Alto Tráfego
- **VPS** (DigitalOcean, AWS, Linode) ou **Servidor Dedicado**

### Para Aprendizado
- **Servidor Próprio** (Windows/Linux local)

---

## Configuração Pós-Deploy

Após hospedar o bot, você precisa:

1. **Registrar os comandos** (execute uma vez):
```powershell
pnpm run register
```

2. **Verificar se o bot está online** no Discord

3. **Testar os comandos** em um servidor

---

## Manutenção Contínua

### Atualizações

1. Faça alterações no código
2. Commit e push para o repositório
3. A maioria das plataformas faz deploy automático
4. Para VPS, você precisa fazer pull manualmente:
```bash
cd BOTus
git pull
pnpm install
pnpm run build
pm2 restart botus
```

### Monitoramento

- **Railway/Render:** Dashboard mostra logs em tempo real
- **VPS:** Use `pm2 logs botus` ou `pm2 monit`
- **Servidor Próprio:** Verifique os logs do console

### Backup

- Mantenha seu código no GitHub/GitLab
- Faça backup do arquivo `.env` (não commite no Git!)
- Considere usar um gerenciador de segredos (ex: GitHub Secrets)

---

## Solução de Problemas Comuns

### Bot não inicia após deploy

- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique os logs da plataforma
- Certifique-se de que o comando de start está correto

### Bot desconecta após alguns minutos

- Verifique se está usando um "Background Worker" no Render
- No Railway, verifique os limites do plano gratuito
- Em VPS, use PM2 para manter o processo ativo

### Comandos não aparecem

- Execute `pnpm run register` após o deploy
- Aguarde até 1 hora para comandos globais aparecerem
- Verifique se o `DISCORD_CLIENT_ID` está correto

---

## Custos Estimados

| Plataforma | Plano | Custo Mensal |
|------------|-------|--------------|
| Railway | Free | $0 (com limites) |
| Railway | Hobby | $5 |
| Render | Free | $0 (com limites) |
| Render | Starter | $7 |
| DigitalOcean | Basic | $4-6 |
| Heroku | Eco | $5 |
| Servidor Próprio | - | $0 (eletricidade) |

---

## Links Úteis

- Railway: https://railway.app
- Render: https://render.com
- DigitalOcean: https://www.digitalocean.com
- PM2: https://pm2.keymetrics.io
- Discord Developer Portal: https://discord.com/developers

