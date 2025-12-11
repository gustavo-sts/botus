import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { WebSearchService } from '../services/webSearchService';

export const data = new SlashCommandBuilder()
  .setName('buscar')
  .setDescription('Busca informações na web sobre um tópico bíblico')
  .addStringOption(option =>
    option.setName('query')
      .setDescription('Termo de busca')
      .setRequired(true))
  .addIntegerOption(option =>
    option.setName('resultados')
      .setDescription('Número de resultados (1-5)')
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(5));

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const query = interaction.options.getString('query', true);
  const resultados = interaction.options.getInteger('resultados') || 3;

  try {
    const webSearchService = new WebSearchService();
    const results = await webSearchService.search(query, resultados);

    if (results.length === 0) {
      await interaction.editReply('Nenhum resultado encontrado para sua busca.');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Resultados da busca: ${query}`)
      .setDescription(results.join('\n\n'))
      .setColor(0x0099FF)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Erro no comando buscar:', error);
    await interaction.editReply('Ocorreu um erro ao processar sua busca.');
  }
}

