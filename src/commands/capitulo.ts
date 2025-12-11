import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BibleService } from '../services/bibleService';
import { OpenAIService } from '../services/openaiService';
import { WebSearchService } from '../services/webSearchService';

export const data = new SlashCommandBuilder()
  .setName('capitulo')
  .setDescription('Busca um capítulo completo da Bíblia')
  .addStringOption(option =>
    option.setName('livro')
      .setDescription('Nome do livro (ex: João, Gênesis)')
      .setRequired(true))
  .addIntegerOption(option =>
    option.setName('capitulo')
      .setDescription('Número do capítulo')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('versao')
      .setDescription('Versão da Bíblia (acf, kjv, nvi, etc)')
      .setRequired(false))
  .addBooleanOption(option =>
    option.setName('buscar_web')
      .setDescription('Buscar contexto adicional na web')
      .setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const livro = interaction.options.getString('livro', true);
  const capitulo = interaction.options.getInteger('capitulo', true);
  const versao = interaction.options.getString('versao') || 'acf';
  const buscarWeb = interaction.options.getBoolean('buscar_web') || false;

  try {
    const bibleService = new BibleService();
    const openaiService = new OpenAIService();
    const webSearchService = new WebSearchService();

    const verses = await bibleService.getChapter(livro, capitulo, versao);

    if (!verses || verses.length === 0) {
      await interaction.editReply('Capítulo não encontrado. Verifique o livro e capítulo.');
      return;
    }

    let webResults: string[] = [];
    if (buscarWeb) {
      webResults = await webSearchService.searchBibleContext(livro, capitulo);
    }

    const fullText = verses.map(v => `${v.verse}. ${v.text}`).join('\n');
    const aiResponse = await openaiService.generateBibleResponse(verses, undefined, webResults);

    const embed = new EmbedBuilder()
      .setTitle(`${verses[0].book} ${capitulo} (${versao.toUpperCase()})`)
      .setDescription(fullText.length > 4096 ? fullText.substring(0, 4093) + '...' : fullText)
      .addFields({ name: 'Análise IA', value: aiResponse.length > 1024 ? aiResponse.substring(0, 1021) + '...' : aiResponse })
      .setColor(0x0099FF)
      .setTimestamp();

    if (webResults.length > 0) {
      embed.addFields({ name: 'Contexto Web', value: webResults.slice(0, 2).join('\n\n') });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Erro no comando capitulo:', error);
    await interaction.editReply('Ocorreu um erro ao processar sua solicitação.');
  }
}

