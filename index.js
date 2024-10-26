const { Client, GatewayIntentBits, Events, REST, Routes } = require('discord.js');
const axios = require('axios');
const schedule = require('node-schedule');
const { token, clientId, guildId, channelId, apiUrl } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    // Register slash command
    const rest = new REST({ version: '9' }).setToken(token);
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: [
                    {
                        name: 'sendcat',
                        description: 'Send a daily cat picture and fact'
                    }
                ] },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();

    // Schedule a job to run at a specific time each day
    const job = schedule.scheduleJob('0 7 * * *', () => {
        console.log('Sending daily cat picture and fact...');
        sendMessage(readyClient, false);
    });
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'sendcat') {
        await interaction.reply('Sending daily cat picture and fact...');
        sendMessage(client, true);
    }
});

async function sendMessage(readyClient, isCommand) {
    try {
        // Fetch cat picture
        const imageResponse = await axios.get(apiUrl);
        const imageUrl = imageResponse.data[0].url;

        // Fetch cat fact
        const factResponse = await axios.get('https://catfact.ninja/fact');
        const catFact = factResponse.data.fact;

        // Fetch cat name
        const nameResponse = await axios.get('https://tools.estevecastells.com/api/cats/v1');
        const fullCatName = nameResponse.data[0]; // Access the first element of the array
        const catName = fullCatName.split(' ')[1]; // Extract the second word

        const channel = readyClient.channels.cache.get(channelId);
        if (channel) {
            const message = isCommand 
                ? `# Bonus cat!!!!! 🐱\n**Name:** ${catName}\n**Random Cat Fact:** ${catFact} - [image](${imageUrl})`
                : `# Cat of the day 🐱\n**Name:** ${catName}\n**Random Cat Fact:** ${catFact} - [image](${imageUrl})`;
            channel.send(message);
        } else {
            console.error('Channel not found!');
        }
    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
}

// Log in to Discord with your client's token
client.login(token);