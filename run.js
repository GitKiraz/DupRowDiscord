// run.js
// Single-file launcher: deploys slash commands (globally or to a guild) and starts the bot.
// Usage: node run.js
require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID || null; // optional: if set, commands will be registered to this guild (faster)

/* Basic checks */
if (!TOKEN) {
  console.error('❌ Missing TOKEN in .env. Add TOKEN=YOUR_TOKEN');
  process.exit(1);
}
if (!CLIENT_ID) {
  console.error('❌ Missing CLIENT_ID in .env. Add CLIENT_ID=YOUR_BOT_CLIENT_ID');
  process.exit(1);
}

/* Create client */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

/* Load command files from ./commands */
const commandsPath = path.join(__dirname, 'commands');
if (!fs.existsSync(commandsPath)) {
  console.error(`❌ Commands folder not found at ${commandsPath}. Create a folder named 'commands' with your command files.`);
  process.exit(1);
}

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
if (commandFiles.length === 0) {
  console.warn('⚠️ No command files found in ./commands. The bot will start but there are no registered commands.');
}

const commands = [];
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  try {
    const command = require(filePath);
    if (!command?.data || typeof command.data.toJSON !== 'function') {
      console.warn(`⚠️ Skipping ${file} — it does not export a 'data' with .toJSON() (SlashCommandBuilder expected).`);
      continue;
    }
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
    console.log(`🔹 Loaded command: ${command.data.name}`);
  } catch (err) {
    console.error(`❌ Error loading command file ${file}:`, err);
  }
}

/* Deploy function */
async function deployCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    console.log('📤 Deploying slash (/) commands...');

    if (GUILD_ID) {
      console.log(`📍 Registering commands to GUILD_ID=${GUILD_ID} (guild commands, immediate)`);
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      );
    } else {
      console.log('🌐 Registering global application commands (may take up to 1 hour to appear)');
      await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
      );
    }

    console.log('✅ Slash commands registered!');
  } catch (err) {
    // More helpful error messages for common causes
    if (err?.rawError && err.rawError.code === 10002) {
      console.error('❌ Discord API returned "Unknown Application" (10002). Check CLIENT_ID and that the bot exists in the Developer Portal.');
    }
    console.error('❌ Error during command deployment:', err);
    // Do not exit here, we might still try to login — but you may choose to exit.
  }
}

/* Interaction handling */
client.once('ready', () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.warn(`⚠️ No command handler found for ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(`❌ Error executing ${interaction.commandName}:`, err);
    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '❌ Error executing command.', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ Error executing command.', ephemeral: true });
      }
    } catch (replyErr) {
      console.error('❌ Failed to send error message to interaction:', replyErr);
    }
  }
});

/* Start: deploy then login */
(async () => {
  await deployCommands();
  try {
    await client.login(TOKEN);
  } catch (loginErr) {
    console.error('❌ Failed to login the bot. Check TOKEN in .env:', loginErr.message || loginErr);
    process.exit(1);
  }
})();
