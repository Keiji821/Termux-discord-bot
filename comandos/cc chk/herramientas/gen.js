const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
name: 'gen',
description: 'Genera tarjetas de crédito aleatorias',
execute(message, args, client) {
const bin = args[0];
const año = args[1];
const mes = args[2];
const ccv = args[3];
axios.get(`https://binchk-api.vercel.app/bin=${bin}`)
.then(response => {
const json = response.data;
let bank = json.bank? json.bank.name : "Desconocido";
let country = json.country? json.country.name : "Desconocido";

const namso = require('namso-cc-gen');
let res = namso.gen({
ShowCCV: true,
ShowExpDate: true,
ShowBank: false,
Month: mes,
Year: año,
Quantity: "10",
Bin: bin,
Format: "PIPE"
});

let cards = res.split("|"); // Divide la cadena en un array de tarjetas

if (cards.length > 0) {
const cardEmbed = new Discord.EmbedBuilder()
.setTitle("Tarjetas de Crédito Generadas")

let fields = [];

if (bank) {
fields.push({ name: "Banco", value: bank, inline: true });
}
if (country) {
fields.push({ name: "País", value: country, inline: true });
}

cardEmbed.addFields(fields)

cardEmbed.setDescription(cards.join("|"))
cardEmbed.setColor("#0099ff");

message.channel.send({ embeds: [cardEmbed] });
} else {
message.channel.send("No se pudieron generar las tarjetas de crédito.");
}
})
.catch(error => {
console.error(error);
});
}
};