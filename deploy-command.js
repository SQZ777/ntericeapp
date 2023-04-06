const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

commandFolders.forEach((folder) => {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  commandFiles.forEach((file) => {
    console.log(`./commands/${folder}/${file}`);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const command = require(`./commands/${folder}/${file}`);
    commands.push(command.data.toJSON());
  });
});

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.discordToken);
// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(process.env.clientId), {
      body: commands,
    });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
