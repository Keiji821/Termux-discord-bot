const Discord = require('discord.js');
const axios = require('axios');
const namso = require('namso-cc-gen');

module.exports = {
  name: 'gen',
  description: 'Genera tarjetas de crédito aleatorias',
  execute(message, args, client) {
    const input = args.join(' ');
    const parts = input.split('|');

    if (parts.length !== 4) {
      return message.channel.send('Error: Formato de entrada incorrecto. Uso: ,gen <bin>|<mes>|<año>|<ccv>');
    }

    let bin = parts[0];
    let month = parts[1];
    let year = parts[2];
    let ccv = parts[3];

    // Validar valores y asignar valores aleatorios si es necesario
    month = month === 'rnd' ? getRandomMonth() : month;
    year = year === 'rnd' ? getRandomYear() : year;
    ccv = ccv === 'rnd' ? getRandomCCV() : ccv;

    axios.get(`https://binchk-api.vercel.app/bin=${bin}`)
      .then(response => {
        const json = response.data;
        const bank = json.bank ? json.bank.name : 'Desconocido';
        const country = json.country ? json.country.name : 'Desconocido';

        generateCards(year, month, bin, bank, country, ccv, message);
      })
      .catch(error => {
        console.error('Error al obtener datos de la API:', error);
        message.channel.send('Error al generar tarjetas de crédito. Intente nuevamente más tarde.');
      });
  }
};

function generateCards(year, month, bin, bank, country, ccv, message) {
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

  const cards = res.split("|");

  if (cards.length > 0) {
    const cardEmbed = new Discord.EmbedBuilder()
      .setTitle('Generador de tarjetas')
      .setColor('#0099ff')
      .addFields(
        { name: 'Formato', value: `${bin}|${month}|${year}|${ccv}`, inline: false },
        { name: '🔢 Bin Data', value: `💳 MASTERCARD - CREDIT - STANDARD`, inline: false }, // Emoji añadido
        { name: '🏦 Bank Data', value: `${bank} - ${country}`, inline: false } // Emoji añadido
      );

    const cardDescription = cards.map(card => {
      return `${card}|${month}|${year}|${ccv}`;
    }).join('\n');

    cardEmbed.addFields({ name: 'Tarjetas generadas', value: cardDescription, inline: false });

    message.channel.send({ embeds: [cardEmbed] });
  } else {
    message.channel.send('No se pudieron generar las tarjetas de crédito.');
  }
}

function getRandomYear() {
  const currentYear = new Date().getFullYear();
  return (currentYear + Math.floor(Math.random() * 10)).toString();
}

function getRandomMonth() {
  const month = Math.floor(Math.random() * 12) + 1;
  return month < 10 ? `0${month}` : month.toString();
}

function getRandomCCV() {
  return Math.floor(Math.random() * 900) + 100;
}