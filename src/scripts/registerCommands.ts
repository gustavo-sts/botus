import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';

config();

const commands: any[] = [];
const commandsPath = join(__dirname, '../commands');
const commandFiles = readdirSync(commandsPath).filter(file => 
  file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('.d.ts'))
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log(`Registrando ${commands.length} comandos...`);

    const clientId = process.env.DISCORD_CLIENT_ID!;

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log('Comandos registrados com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
})();

