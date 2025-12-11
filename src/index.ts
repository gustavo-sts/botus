import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { Command } from './types/Command';

const envPath = join(__dirname, '../.env');
if (!existsSync(envPath)) {
  console.error('❌ ERRO: Arquivo .env não encontrado!');
  console.error('📝 Crie um arquivo .env na raiz do projeto com as seguintes variáveis:');
  console.error('');
  console.error('DISCORD_TOKEN=seu_token_do_discord');
  console.error('OPENAI_API_KEY=sua_chave_openai');
  console.error('DISCORD_CLIENT_ID=seu_client_id');
  console.error('BRAVE_API_KEY=sua_chave_brave_opcional');
  console.error('');
  console.error('💡 Consulte SETUP.md para instruções detalhadas.');
  process.exit(1);
}

config();

const requiredEnvVars = ['DISCORD_TOKEN', 'OPENAI_API_KEY', 'DISCORD_CLIENT_ID'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ ERRO: Variáveis de ambiente ausentes!');
  console.error(`📝 As seguintes variáveis são obrigatórias: ${missingVars.join(', ')}`);
  console.error('');
  console.error('💡 Verifique seu arquivo .env e certifique-se de que todas as variáveis estão configuradas.');
  process.exit(1);
}

if (!process.env.DISCORD_TOKEN || process.env.DISCORD_TOKEN.trim() === '') {
  console.error('❌ ERRO: DISCORD_TOKEN está vazio ou inválido!');
  console.error('💡 Verifique se o token está correto no arquivo .env');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection<string, Command>();

const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
}

const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_TOKEN);

