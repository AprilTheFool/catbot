# CatBot
A simple Discord bot that posts a cat picture, name, and fact once per day.
Can also be used with /sendcat

![preview1](https://github.com/user-attachments/assets/e038c3c7-f720-470f-91b6-28b0b3c710e8)

## Install:

1: Clone the repo

```git clone https://github.com/AprilTheFool/catbot```

2: Create a config.json file in the root

```
{
    "token": "", // your discord bot token (https://discord.com/developers/applications)
    "channelId": "", // the channel id the bot should use
    "apiUrl": "https://api.thecatapi.com/v1/images/search", // dont change
    "clientId": "", // your application ID
    "guildId": "" // your server ID
}
```

3: Run the bot with ```node index.js```

4: Enjoy :)
