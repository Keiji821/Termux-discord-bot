const Discord = require('discord.js');
const namso = require('namso-cc-gen');

module.exports = {
name: 'gen',
description: 'Genera tarjetas de crédito aleatorias',
execute(message, args) {
const bin = args[0];

let res = namso.gen({
ShowCCV: true,
ShowExpDate: true,
ShowBank: false,
Month: "01",
Year: "2022",
Quantity: "10", // Generar 10 tarjetas
Bin: bin,
Format: "PIPE"
});

const cards = res.map((card, index) => {
return `**Tarjeta ${index + 1}**

Número de tarjeta: ${card.number}

CVV: ${card.cvv}

Fecha de expiración: ${card.exp.month}/${card.exp.year}

`;
});

const cardEmbed = new Discord.EmbedBuilder()
.setTitle("Tarjetas de Crédito Generadas")
.setDescription(cards.join("

"))
.setColor("#0099ff");

message.channel.send({ embeds: [cardEmbed] });
}
};
