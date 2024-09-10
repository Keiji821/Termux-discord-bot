const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
name: 'gen',
description: 'Genera tarjetas de crédito aleatorias',
execute(message, args, client) {
const input = args.join(' ');
const parts = input.split('|');

let bin, year, month, ccv;

if (parts.length === 1) {
bin = getRandomBin();
year = getRandomYear();
month = getRandomMonth();
ccv = getRandomCCV();
} else if (parts.length === 4) {
bin = parts[0];
year = parts[2] === 'rnd' || parts[2] === 'xxx'? getRandomYear() : parts[2];
month = parts[1] === 'rnd' || parts[1] === 'xxx'? getRandomMonth() : parts[1];
ccv = parts[3] === 'rnd' || parts[3] === 'xxx'? getRandomCCV() : parts[3];
} else {
return message.channel.send('Error: Formato de entrada incorrecto. Uso:,gen <bin> o,gen <bin>|<mes>|<año>|<ccv>');
}

axios.get(`https://binchk-api.vercel.app/bin=${bin}`)
.then(response => {
const json = response.data;
const bank = json.bank? json.bank.name : "Desconocido";
const country = json.country? json.country.name : "Desconocido";

generateCards(year, month, bin, bank, country, message);
})
.catch(error => {
console.error('Error al obtener datos de la API:', error);
message.channel.send('Error al generar tarjetas de crédito. Intente nuevamente más tarde.');
});
}
};


function generateCards(year, month, bin, bank, country, message) {
const namso = require('namso-cc-gen');
const res = namso.gen({
ShowCCV: true,
ShowExpDate: true,
ShowBank: false,
Month: month,
Year: year,
Quantity: "10",
Bin: bin,
Format: "PIPE"
});

const cards = res.split("|"); // Divide la cadena en un array de tarjetas

if (cards.length > 0) {
const cardEmbed = new Discord.EmbedBuilder() 
.setTitle("Tarjetas de Crédito Generadas");

let fields = [];

if (bank) {
fields.push({ name: "Banco", value: bank, inline: true });
}
if (country) {
fields.push({ name: "País", value: country, inline: true });
}

const ccvGenerated = getRandomCCV(); // Generar CCV aleatoriamente

const cardDescription = cards.map(card => {
return `${card} | CCV: ${ccvGenerated}`;
}).join("
"); // Cambiar join("/") por join("
")

cardEmbed.addFields(fields);
cardEmbed.setDescription(cardDescription);
cardEmbed.setColor("#0099ff");

message.channel.send({ embeds: [cardEmbed] });
} else {
message.channel.send("No se pudieron generar las tarjetas de crédito.");
}
}