import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BibleService } from '../services/bibleService';
import { OpenAIService } from '../services/openaiService';
import { WebSearchService } from '../services/webSearchService';

export const data = new SlashCommandBuilder()
  .setName('comparar')
  .setDescription('Compara um versículo entre versões católicas e protestantes')
  .addStringOption(option =>
    option.setName('livro')
      .setDescription('Nome do livro (ex: João, Gênesis)')
      .setRequired(true))
  .addIntegerOption(option =>
    option.setName('capitulo')
      .setDescription('Número do capítulo')
      .setRequired(true))
  .addIntegerOption(option =>
    option.setName('versiculo')
      .setDescription('Número do versículo')
      .setRequired(true))
  .addBooleanOption(option =>
    option.setName('buscar_web')
      .setDescription('Buscar contexto adicional na web')
      .setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const livro = interaction.options.getString('livro', true);
  const capitulo = interaction.options.getInteger('capitulo', true);
  const versiculo = interaction.options.getInteger('versiculo', true);
  const buscarWeb = interaction.options.getBoolean('buscar_web') || false;

  try {
    const bibleService = new BibleService();
    const openaiService = new OpenAIService();
    const webSearchService = new WebSearchService();

    const catholicVersions = bibleService.getCatholicVersions();
    const protestantVersions = bibleService.getProtestantVersions();
    const allVersions = [...catholicVersions, ...protestantVersions];

    const verses = await bibleService.compareVersions(livro, capitulo, versiculo, allVersions);

    let webResults: string[] = [];
    if (buscarWeb) {
      webResults = await webSearchService.searchBibleContext(livro, capitulo, versiculo);
    }

    const comparison = await openaiService.compareBibleVersions(verses, webResults);

    const embed = new EmbedBuilder()
      .setTitle(`Comparação: ${livro} ${capitulo}:${versiculo}`)
      .setDescription(comparison)
      .setColor(0x0099FF)
      .setTimestamp();

    const versesText = Array.from(verses.entries())
      .filter(([_, verse]) => verse !== null)
      .map(([version, verse]) => `**${version.toUpperCase()}**: ${verse!.text}`)
      .join('\n\n');

    embed.addFields({ name: 'Versões Comparadas', value: versesText });

    if (webResults.length > 0) {
      embed.addFields({ name: 'Contexto Web', value: webResults.slice(0, 2).join('\n\n') });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Erro no comando comparar:', error);
    await interaction.editReply('Ocorreu um erro ao processar sua solicitação.');
  }
}

