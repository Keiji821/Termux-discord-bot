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
        const bank = json.bank && json.bank.name ? json.bank.name : 'Desconocido';
        const country = json.country && json.country.name ? json.country.name : 'Desconocido';
        const currency = json.country && json.country.currency ? json.country.currency : 'Desconocido';
        const emoji = json.country && json.country.emoji ? json.country.emoji : ''; // Obtener emoji del país

        generateCards(year, month, bin, bank, country, currency, emoji, ccv, message);
      })
      .catch(error => {
        console.error('Error al obtener datos de la API:', error);
        message.channel.send('Error al generar tarjetas de crédito. Intente nuevamente más tarde.');
      });
  }
};

function generateCards(year, month, bin, bank, country, currency, emoji, message) {
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
      .setTitle('Card Generator')
      .setColor('#0099ff')
      .addFields(
        { name: 'Format', value: `${bin}|${month}|${year}`, inline: false }, // Eliminamos el CCV fijo
        { name: 'Bin Data', value: `💳 MASTERCARD - CREDIT - STANDARD`, inline: false }, // Datos de la tarjeta
        { name: 'Bank Data', value: `🏦 ${bank} - ${emoji} ${country} - ${currency}`, inline: false } // Datos del banco con emoji y moneda
      );

    const cardDescription = cards.map(card => {
      const randomCCV = getRandomCCV();  // Generar un nuevo CCV para cada tarjeta
      return `${card}|${month}|${year}|${randomCCV}`;
    }).join('\n');

    cardEmbed.addFields({ name: 'Generated Cards', value: cardDescription, inline: false });

    message.channel.send({ embeds: [cardEmbed] });
  } else {
    message.channel.send('No se pudieron generar las tarjetas de crédito.');
  }
}