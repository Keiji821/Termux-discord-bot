const Discord = require('discord.js');
const https = require('https');

module.exports = {
name: 'husbando',
description: 'Obtiene una imagen de husbando aleatoria',
execute(message, args, client, prefix) {
if (!message.content.startsWith(prefix)) return;
https.get('https://nekos.best/api/v2/husbando', (res) => {
let data = '';
res.on('data', (chunk) => {
data += chunk;
});
res.on('end', () => {
const json = JSON.parse(data);
const nekoImage = json.results[0].url;
const sourceUrl = json.results[0].source_url;
const artistName = json.results[0].artist_name;

const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

const nekoEmbed = new Discord.EmbedBuilder()
.setColor(randomColor) 
.setTitle(`Imagen de husbando obtenida de ${sourceUrl}`)
.setImage(nekoImage)
.setTimestamp() 
.setFooter({ text: `Autor: ${artistName}` }); 

message.channel.send({ embeds: [nekoEmbed] });
});
});
}
};