import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const envPath = join(__dirname, '../../.env');
const envExamplePath = join(__dirname, '../../.env.example');

console.log('🔍 Verificando configuração do ambiente...\n');

if (!existsSync(envPath)) {
  console.log('⚠️  Arquivo .env não encontrado!\n');
  
  if (existsSync(envExamplePath)) {
    console.log('📝 Criando arquivo .env a partir do .env.example...');
    const exampleContent = readFileSync(envExamplePath, 'utf-8');
    writeFileSync(envPath, exampleContent);
    console.log('✅ Arquivo .env criado!\n');
    console.log('⚠️  IMPORTANTE: Configure as variáveis no arquivo .env antes de executar o bot!\n');
  } else {
    console.log('📝 Criando arquivo .env...');
    const defaultEnv = `DISCORD_TOKEN=seu_token_do_discord_aqui
OPENAI_API_KEY=sua_chave_openai_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui
BRAVE_API_KEY=sua_chave_brave_opcional
`;
    writeFileSync(envPath, defaultEnv);
    console.log('✅ Arquivo .env criado!\n');
    console.log('⚠️  IMPORTANTE: Configure as variáveis no arquivo .env antes de executar o bot!\n');
  }
  process.exit(0);
}

const envContent = readFileSync(envPath, 'utf-8');
const requiredVars = ['DISCORD_TOKEN', 'OPENAI_API_KEY', 'DISCORD_CLIENT_ID'];
const missingVars: string[] = [];

for (const varName of requiredVars) {
  const regex = new RegExp(`^${varName}=`, 'm');
  if (!regex.test(envContent) || envContent.match(regex)?.[0]?.includes('_aqui') || envContent.match(regex)?.[0]?.includes('seu_')) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.log('⚠️  Variáveis de ambiente não configuradas:\n');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n💡 Configure essas variáveis no arquivo .env antes de executar o bot.');
  console.log('📖 Consulte SETUP.md para instruções detalhadas.\n');
  process.exit(1);
}

console.log('✅ Todas as variáveis de ambiente estão configuradas!\n');

