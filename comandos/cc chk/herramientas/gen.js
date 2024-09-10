const Discord = require('discord.js');
const https = require('https');

module.exports = {
  name: 'gen',
  description: 'Genera tarjetas de crédito aleatorias',
  execute(message, args, client) {
    const bin = args[0];
    https.get(`https://binchk-api.vercel.app/bin=${bin}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const json = JSON.parse(data);
        const bank = json.bank.name;
        const country = json.country.name;

        const namso = require('namso-cc-gen');
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

Banco: ${bank}
País: ${country}
`;
        });

        const cardEmbed = new Discord.EmbedBuilder()
         .setTitle("Tarjetas de Crédito Generadas")
         .setDescription(cards.join("
"))
         .setColor("#0099ff");

        message.channel.send({ embeds: [cardEmbed] });
      });
    });
  }
};