const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('duprow')
    .setDescription('Duplicate a role with all channel permissions')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to duplicate')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('newname')
        .setDescription('New name for the duplicated role')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction, client) {
    const mentionedRole = interaction.options.getRole('role');
    const newName = interaction.options.getString('newname') || `${mentionedRole.name} - Copy`;

    await interaction.reply(`⏳ **Step 1/3:** Creating new role...`);

    try {
      const newRole = await interaction.guild.roles.create({
        name: newName,
        color: mentionedRole.color,
        permissions: mentionedRole.permissions.bitfield,
        hoist: mentionedRole.hoist,
        mentionable: mentionedRole.mentionable,
        position: mentionedRole.position - 1,
        reason: `Role duplicated from ${mentionedRole.name}`
      });

      await interaction.editReply(`⏳ **Step 2/3:** Copying permissions across all channels...`);

      const allChannels = await interaction.guild.channels.fetch();
      let channelsWithPermissions = 0;
      let channelsUpdated = 0;

      for (const [id, channel] of allChannels) {
        const originalPermissions = channel.permissionOverwrites.cache.get(mentionedRole.id);
        if (!originalPermissions) continue;

        channelsWithPermissions++;

        const allowValue = originalPermissions.allow.bitfield.toString();
        const denyValue = originalPermissions.deny.bitfield.toString();

        try {
          await client.rest.put(
            `/channels/${channel.id}/permissions/${newRole.id}`,
            {
              body: {
                allow: allowValue,
                deny: denyValue,
                type: 0
              }
            }
          );
          channelsUpdated++;
        } catch {
          await channel.permissionOverwrites.create(newRole.id, {
            allow: allowValue,
            deny: denyValue
          });
          channelsUpdated++;
        }

        await new Promise(r => setTimeout(r, 300));
      }

      await interaction.editReply(
        `✅ **DUPLICATION COMPLETE!**\n\n` +
        `📋 Original Role: ${mentionedRole}\n` +
        `🆕 New Role: ${newRole}\n\n` +
        `📌 Channels with permissions: ${channelsWithPermissions}\n` +
        `📁 Channels updated: ${channelsUpdated}\n\n` +
        `Use /testrow to verify.`
      );

    } catch (error) {
      console.error(error);
      await interaction.editReply(`❌ Error: \`\`\`${error.message}\`\`\``);
    }
  }
};
