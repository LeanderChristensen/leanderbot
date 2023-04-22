# leanderbot

leanderbot is a discord bot that I created to use chatgpt together with my friends, it remembers the conversation and you can make it remember information about you and your friends long term and give it personality resulting in a very personalised experience.

# Features

- Responds to messages in your "chatgpt" channel using OpenAI's GPT-4.
- Responds to messages as a [jailbroken](https://www.jailbreakchat.com/) chatgpt in your "jailbreak" channel.
- Remembers information stored in your "facts" channel.
- Personalizes conversations by combining your list of friends names and the facts list.
- Plays the "Bruh" sound effect when the !bruh command is used.
- Customizable personality by modifying the facts array or typing in the facts channel.
- Error and alert messages sent to a dedicated channel.

# Setup

- Clone the repository to your local machine. ```git clone https://github.com/LeanderChristensen/leanderbot/```
- Run ```npm install``` to install all dependencies.
- Rename the .env.sample file to .env and add your [Discord bot token](https://discord.com/developers/applications) and [OpenAI API key](https://platform.openai.com/account/api-keys)
- Update the config.json file with your Discord channel IDs (Enable Developer Mode in Discord ➡️ right click channel ➡️ "Copy Channel ID") for chatgpt, chatgpt (jailbreaked), facts, error/notifications channel, as well as your name and your friends names.
- Start the bot by running ```node app.js```

# Usage

- Type messages in your chatgpt channel to interact with the bot.
- Type messages in your jailbreak chatgpt channel to interact with the bot in jailbreak mode.
- Type facts about yourself and your friends in the facts channel for the bot to remember and utilize.
- Type ```reset```to reset the bots memory
- Use the !bruh command to have the bot join your voice channel and play the "Bruh" sound effect.

# Customization

You can customize the bot's personality by adding extra facts like { role: 'system', content: 'Act like a gigachad' } to the facts array. Examples include a bot I made that is very nice to a specific friend (its master) and mean to others, or another bot that acts insane and crazy.

# Notes

- If the facts + memory array becomes too long the bot won't respond, then you need to type ```reset``` to reset the memory array.
- If the jailbreak string becomes patched and outdated, you have to update it to an up to date one from the internet. The jailbreak string I use sends "Normal Output" and "Developer Mode Output", so I have included code that removes everything before the jailbreaked output. That code will not work with other jailbreak strings, so you have to either remove that code or modify it.
- If you remove stuff from the config, the code might break.
