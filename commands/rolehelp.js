const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolehelp')
    .setDescription('Show help for role duplication commands'),

  async execute(interaction) {
    await interaction.reply(
      `📚 **Role Commands:**\n\n` +
      `🔹 **/duprole role:@Role newname:** Duplicate a role\n` +
      `🔹 **/testrow role:@Role:** Inspect permissions\n\n` +
      `⚠️ You need Administrator permissions`
    );
  }
};
