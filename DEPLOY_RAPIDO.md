# Deploy Rápido - BOTus

Guia rápido para fazer deploy em diferentes plataformas.

## 🚀 Railway (Mais Fácil - Recomendado)

### Passo a Passo:

1. **Crie conta:** https://railway.app (login com GitHub)

2. **Crie novo projeto:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Conecte seu repositório

3. **Configure variáveis de ambiente:**
   - Vá em "Variables"
   - Adicione:
     - `DISCORD_TOKEN`
     - `OPENAI_API_KEY`
     - `DISCORD_CLIENT_ID`
     - `BRAVE_API_KEY` (opcional)

4. **Deploy automático:**
   - Railway detecta automaticamente o `railway.json`
   - O bot será implantado automaticamente

5. **Registre comandos:**
   - Execute localmente: `pnpm run register`
   - Ou adicione como script de deploy no Railway

**Pronto!** Seu bot está no ar! 🎉

---

## 🌐 Render

### Passo a Passo:

1. **Crie conta:** https://render.com (login com GitHub)

2. **Crie novo serviço:**
   - Clique em "New +" > "Background Worker"
   - Conecte seu repositório

3. **Configure:**
   - **Name:** botus
   - **Environment:** Node
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `pnpm start`

4. **Adicione variáveis de ambiente:**
   - Vá em "Environment"
   - Adicione todas as variáveis necessárias

5. **Deploy:**
   - Clique em "Create Background Worker"
   - Aguarde o deploy

6. **Registre comandos:**
   - Execute localmente: `pnpm run register`

**Pronto!** Seu bot está no ar! 🎉

---

## 🐳 VPS (DigitalOcean)

### Passo a Passo:

1. **Crie Droplet:**
   - Acesse https://www.digitalocean.com
   - Crie um Droplet Ubuntu 22.04 ($4/mês)

2. **Conecte via SSH:**
```powershell
ssh root@seu_ip
```

3. **Instale dependências:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git
npm install -g pnpm pm2
```

4. **Clone e configure:**
```bash
git clone seu_repositorio
cd BOTus
nano .env
# Cole suas variáveis de ambiente
# Salve com Ctrl+X, Y, Enter
```

5. **Instale, compile e inicie:**
```bash
pnpm install
pnpm run build
pnpm run register
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Pronto!** Seu bot está rodando 24/7! 🎉

---

## 💻 Servidor Próprio (Windows)

### Passo a Passo:

1. **Instale Node.js:**
   - Baixe em: https://nodejs.org
   - Instale a versão LTS

2. **Instale pnpm:**
```powershell
npm install -g pnpm
```

3. **Clone o projeto:**
```powershell
git clone seu_repositorio
cd BOTus
```

4. **Configure:**
   - Crie arquivo `.env` com suas variáveis

5. **Instale e execute:**
```powershell
pnpm install
pnpm run build
pnpm run register
pnpm start
```

**Para manter rodando 24/7:**
- Use PM2: `npm install -g pm2 pm2-windows-startup`
- Execute: `pm2 start dist/index.js --name botus`
- Configure startup: `pm2-startup install`

---

## ✅ Verificação Pós-Deploy

Após fazer deploy, verifique:

1. ✅ Bot aparece como "online" no Discord
2. ✅ Comandos aparecem ao digitar `/` no Discord
3. ✅ Teste um comando simples: `/versiculo livro:João capitulo:3 versiculo:16`

---

## 🔧 Troubleshooting

### Bot não inicia
- Verifique logs na plataforma
- Confirme que todas as variáveis de ambiente estão configuradas
- Verifique se o token do Discord está correto

### Comandos não aparecem
- Execute `pnpm run register` novamente
- Aguarde até 1 hora (comandos globais podem demorar)
- Verifique se o `DISCORD_CLIENT_ID` está correto

### Bot desconecta
- Railway/Render: Verifique limites do plano gratuito
- VPS: Use PM2 para manter processo ativo
- Verifique logs para erros

---

## 📊 Comparação Rápida

| Plataforma | Dificuldade | Custo | Recomendado Para |
|------------|-------------|-------|------------------|
| Railway | ⭐ Fácil | $0-5/mês | Iniciantes |
| Render | ⭐⭐ Médio | $0-7/mês | Projetos pequenos |
| VPS | ⭐⭐⭐ Avançado | $4-6/mês | Produção |
| Servidor Próprio | ⭐⭐ Médio | $0 | Testes locais |

---

## 🆘 Precisa de Ajuda?

- Consulte [HOSPEDAGEM.md](./HOSPEDAGEM.md) para guia completo
- Consulte [SETUP.md](./SETUP.md) para configuração inicial
- Verifique os logs da plataforma para erros específicos

