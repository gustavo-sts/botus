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
- Plano gratuito disponível (Web Service)
- Deploy automático via GitHub
- Fácil configuração
- O bot inclui servidor HTTP para funcionar como Web Service

**Passos:**

1. Acesse https://render.com
2. Faça login com GitHub
3. Clique em "New +" > **"Web Service"** (gratuito)
4. Conecte seu repositório
5. Configure:
   - **Name:** botus (ou qualquer nome)
   - **Environment:** Node
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `pnpm start`
6. Adicione as variáveis de ambiente na seção "Environment"
7. Clique em "Create Web Service"

**⚠️ IMPORTANTE:** 
- Use **Web Service** (gratuito) - o bot já está configurado com servidor HTTP
- Background Workers são **PAGOS** no Render
- Web Services gratuitos podem ser suspensos após 15 minutos de inatividade, mas o bot se reconecta automaticamente quando há tráfego
- O bot responde em `/health` ou `/` para manter o serviço ativo