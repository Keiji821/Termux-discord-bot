const Discord = require('discord.js');
const https = require('https');

module.exports = {
name: 'waifu',
description: 'Obtiene una imagen de waifu aleatoria',
execute(message, args, client) {
https.get('https://nekos.best/api/v2/waifu', (res) => {
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
.setColor(randomColor) // Establece un color aleatorio
.setTitle(`Imagen de waifu obtenida de ${sourceUrl}`)
.setImage(nekoImage)
.setTimestamp() // Añade un timestamp al embed
.setFooter({ text: `Autor: ${artistName}` }); // Añade un pie de página con el autor de la imagen

message.channel.send({ embeds: [nekoEmbed] });
});
});
}
};