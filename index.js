const axios = require('axios');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, channelId, apiUrl } = require('./config.json');
const schedule = require('node-schedule');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    // Schedule a job to run at a specific time each day
    const job = schedule.scheduleJob('0 8 * * *', () => {
        console.log('Sending daily cat picture and fact...');
        const sendMessage = async () => {
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
                    channel.send(`# Cat of the day 🐱\n**Name:** ${catName}\n**Random Cat Fact:** ${catFact} - [image](${imageUrl})`);
                } else {
                    console.error('Channel not found!');
                }
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        sendMessage();
    });
});

// Log in to Discord with your client's token
client.login(token);