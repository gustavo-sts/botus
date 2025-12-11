import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BibleService } from '../services/bibleService';
import { OpenAIService } from '../services/openaiService';
import { WebSearchService } from '../services/webSearchService';

export const data = new SlashCommandBuilder()
  .setName('versiculo')
  .setDescription('Busca um versículo bíblico e gera explicação com IA')
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
  .addStringOption(option =>
    option.setName('versao')
      .setDescription('Versão da Bíblia (acf, kjv, nvi, etc)')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('pergunta')
      .setDescription('Pergunta opcional sobre o versículo')
      .setRequired(false))
  .addBooleanOption(option =>
    option.setName('buscar_web')
      .setDescription('Buscar contexto adicional na web')
      .setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const livro = interaction.options.getString('livro', true);
  const capitulo = interaction.options.getInteger('capitulo', true);
  const versiculo = interaction.options.getInteger('versiculo', true);
  const versao = interaction.options.getString('versao') || 'acf';
  const pergunta = interaction.options.getString('pergunta');
  const buscarWeb = interaction.options.getBoolean('buscar_web') || false;

  try {
    const bibleService = new BibleService();
    const openaiService = new OpenAIService();
    const webSearchService = new WebSearchService();

    const verse = await bibleService.getVerse(livro, capitulo, versiculo, versao);

    if (!verse) {
      await interaction.editReply('Versículo não encontrado. Verifique o livro, capítulo e versículo.');
      return;
    }

    let webResults: string[] = [];
    if (buscarWeb) {
      webResults = await webSearchService.searchBibleContext(livro, capitulo, versiculo);
    }

    const verses = [verse];
    const aiResponse = await openaiService.generateBibleResponse(verses, pergunta || undefined, webResults);

    const embed = new EmbedBuilder()
      .setTitle(`${verse.book} ${verse.chapter}:${verse.verse} (${verse.version})`)
      .setDescription(verse.text)
      .addFields({ name: 'Explicação IA', value: aiResponse })
      .setColor(0x0099FF)
      .setTimestamp();

    if (webResults.length > 0) {
      embed.addFields({ name: 'Contexto Web', value: webResults.slice(0, 2).join('\n\n') });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Erro no comando versiculo:', error);
    await interaction.editReply('Ocorreu um erro ao processar sua solicitação.');
  }
}

