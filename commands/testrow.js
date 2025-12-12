const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testrow')
    .setDescription('Show all channel permissions for a role')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to inspect')
        .setRequired(true)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const channels = await interaction.guild.channels.fetch();

    let result = [];
    for (const [id, channel] of channels) {
      const perm = channel.permissionOverwrites.cache.get(role.id);
      if (!perm) continue;

      result.push(
        `📁 **${channel.name}**\n` +
        (perm.allow.toArray().length ? `   ✅ Allow: ${perm.allow.toArray().join(', ')}\n` : '') +
        (perm.deny.toArray().length ? `   ❌ Deny: ${perm.deny.toArray().join(', ')}\n` : '')
      );
    }

    if (result.length === 0)
      return interaction.reply(`❌ Role ${role} has no specific channel permissions.`);

    await interaction.reply({
      content: `🔍 **Permissions for ${role.name}:**\n\n${result.join('\n')}`.slice(0, 1900)
    });
  }
};
