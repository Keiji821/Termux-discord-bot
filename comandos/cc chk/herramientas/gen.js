const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
name: 'gen',
description: 'Genera tarjetas de crédito aleatorias',
execute(message, args, client) {
const bin = args[0];
const month = args[1];
const year = args[2];
const ccv = args[3];

axios.get(`https://binchk-api.vercel.app/bin=${bin}`)
.then(response => {
const json = response.data;
const bank = json.bank.name;
const country = json.country.name;

const namso = require('namso-cc-gen');
let res = namso.gen({
ShowCCV: true,
ShowExpDate: true,
ShowBank: false,
Month: month,
Year: year,
Quantity: "10", // Generar 10 tarjetas
Bin: bin,
Format: "PIPE",
CCV: ccv
});

let cards = res.split("|");
let cardList = [];

for (let i = 0; i < cards.length; i += 4) {
cardList.push(`**Tarjeta ${i / 4 + 1}**
Número de tarjeta: ${cards[i]}
Fecha de expiración: ${cards[i + 1]}/${cards[i + 2]}
CCV: ${cards[i + 3]}`);
}

const cardEmbed = new Discord.EmbedBuilder()
.setTitle("Tarjetas de Crédito Generadas")
.setDescription(cardList.join("
"))
.setColor("#0099ff");

message.channel.send({ embeds: [cardEmbed] });
})
.catch(error => {
console.error(error);
});
}
};