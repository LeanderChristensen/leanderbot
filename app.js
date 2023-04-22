import dotenv from 'dotenv';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import config from './config.json' assert { type: 'json' };  const { creator, botChannels, friends } = config;
import { ask, askJailbreak } from './ai.js';
import fs from 'fs';

dotenv.config();
const DISCORD_API_MAX_LENGTH = 2000;
let botName = '';
let newfacts = [];
let facts = [];
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});
process.on('uncaughtException', (error) => {
	console.error(error);
	const channel = client.channels.cache.get(botChannels.other);
	if (error) channel.send(error);
});

client.once(Events.ClientReady, () => {
	botName = client.user.username;
	console.log(`Ready! Logged in as ${botName}`);
	client.channels.cache
		.get(botChannels.other)
		.send(`${botName} is now online!`);
	facts = [
		{ role: 'system', content: `Your name is ${botName}` },
		{ role: 'system', content: `Your creator is called ${creator}` },
		{ role: 'system', content: `You are in a Discord server called ${client.guilds.cache.first().name}` }
	];
	// Add all facts from the facts discord channel to the facts array
	client.channels.fetch(botChannels.facts).then((factsChannel) => {
		factsChannel.messages.fetch().then((messages) => {
			messages.reverse().forEach((message) => {
				facts.push({ role: 'system', content: message.content });
			});
		});
	});
});

client.on(Events.MessageCreate, async (message) => {
	try {
		if (message.author.bot) return; // Ignore other bots
			if (message.content.toLowerCase() === '!bruh') { // Join voice channel and play bruh.mp3 then leave
				if (message.member.voice.channel) {
					const channel = message.member.voice.channel;
					const connection = joinVoiceChannel({
						channelId: channel.id,
						guildId: channel.guild.id,
						adapterCreator: channel.guild.voiceAdapterCreator,
					});
					connection.subscribe(createAudioPlayer());
					const audioResource = createAudioResource(
						fs.createReadStream('bruh.mp3')
					);
					const audioPlayer = createAudioPlayer();
					audioPlayer.play(audioResource);
					connection.subscribe(audioPlayer);
					audioPlayer.on(AudioPlayerStatus.Idle, () => {
						connection.destroy();
					});
					return;
				}
				return;
			}
		let answer;
		switch (message.channelId) {
			case botChannels.facts:
				facts.push({ role: 'system', content: message.content });
				newfacts.push({ role: 'system', content: message.content });
				console.log(`Adding ${message.content} to facts`);
				return;
			case botChannels.chatgpt:
				// ChatGPT
				answer = await ask(message.content, message.author.username, message.author.toString(), botName, creator, facts, friends, newfacts);
				newfacts = [];
				break;
			case botChannels.jailbreak:
				// ChatGPT Jailbreaked
				answer = await askJailbreak(message.content, message.author.username, message.author.toString(), botName, creator, facts, friends);
				break;
		}
		if (answer && answer.length > DISCORD_API_MAX_LENGTH) {
			console.error('Message is too long, splitting message ...');
			const answerParts = answer.match(
				new RegExp(`.{1,${DISCORD_API_MAX_LENGTH}}`, 'g')
			);
			answerParts.forEach((part) => {
				client.channels
					.fetch(message.channelId)
					.then((channel) => channel.send(part));
			});
			return;
		}
		if (answer && answer.trim() !== '') {
			client.channels
				.fetch(message.channelId)
				.then((channel) => channel.send(answer));
			return;
		} else {
			console.log('Message is empty');
			return;
		}
	} catch (error) {
		console.error(`Error processing message: ${error.message}`);
		try {
			await client.channels.cache
				.get(botChannels.other)
				.send(error.toString());
		} catch (innerError) {
			console.error(`Error sending message to the channel: ${innerError.message}`);
		}
		return;
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
