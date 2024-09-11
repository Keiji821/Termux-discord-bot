const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const namso = require('namso-cc-gen');

module.exports = {
  name: 'gen',
  description: 'Genera tarjetas de crédito aleatorias',
  async execute(message, args) {
    const input = args.join(' ');
    const parts = input.split('|');

    // Verifica que el formato de entrada sea correcto
    if (parts.length !== 4) {
      return message.channel.send('Error: Formato de entrada incorrecto. Uso: ,gen <bin>|<mes>|<año>|<ccv>');
    }

    let bin = parts[0];
    let month = parts[1];
    let year = parts[2];
    let ccv = parts[3];

    // Validar valores aleatorios si es necesario
    month = month === 'rnd' ? getRandomMonth() : month;
    year = year === 'rnd' ? getRandomYear() : year;
    ccv = ccv === 'rnd' ? getRandomCCV() : ccv;

    // Verificación de BIN usando la API
    try {
      const response = await axios.get(`https://binchk-api.vercel.app/bin/${bin}`);
      const json = response.data;
      
      // Datos del BIN
      const bank = json.bank && json.bank.name ? json.bank.name : 'Desconocido';
      const country = json.country && json.country.name ? json.country.name : 'Desconocido';
      const currency = json.country && json.country.currency ? json.country.currency : 'Desconocido';
      const emoji = json.country && json.country.emoji ? json.country.emoji : ''; 

      // Generar las tarjetas de crédito
      generateCards(year, month, bin, bank, country, currency, emoji, message);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
      return message.channel.send('Error al generar tarjetas de crédito. Intente nuevamente más tarde.');
    }
  }
};

// Función para generar las tarjetas
function generateCards(year, month, bin, bank, country, currency, emoji, message) {
  // Generar tarjetas utilizando namso-cc-gen
  const res = namso.gen({
    ShowCCV: true,
    ShowExpDate: true,
    ShowBank: false,
    Month: month,
    Year: year,
    Quantity: 10,
    Bin: bin,
    Format: "PIPE"
  });

  const cards = res.split("|");

  // Si se generaron tarjetas correctamente
  if (cards.length > 0) {
    const cardEmbed = new EmbedBuilder()
      .setTitle('Generador de Tarjetas')
      .setColor('#0099ff')
      .addFields(
        { name: 'Formato', value: `${bin}|${month}|${year}`, inline: false },
        { name: 'Datos del BIN', value: `💳 MASTERCARD - CREDIT - STANDARD`, inline: false },
        { name: 'Datos del Banco', value: `🏦 ${bank} - ${emoji} ${country} - ${currency}`, inline: false }
      );

    const cardDescription = cards.map(card => {
      const randomCCV = getRandomCCV();  // Generar un nuevo CCV para cada tarjeta
      return `${card}|${month}|${year}|${randomCCV}`;
    }).join('\n');

    cardEmbed.addFields({ name: 'Tarjetas Generadas', value: cardDescription, inline: false });

    message.channel.send({ embeds: [cardEmbed] });
  } else {
    message.channel.send('No se pudieron generar las tarjetas de crédito.');
  }
}

// Funciones auxiliares para generar valores aleatorios
function getRandomMonth() {
  const month = Math.floor(Math.random() * 12) + 1;
  return month.toString().padStart(2, '0'); // Asegura que sea de dos dígitos
}

function getRandomYear() {
  const currentYear = new Date().getFullYear();
  const year = currentYear + Math.floor(Math.random() * 5);
  return year.toString().slice(2); // Devuelve los últimos dos dígitos
}

function getRandomCCV() {
  return Math.floor(100 + Math.random() * 900).toString(); // CCV aleatorio de 3 dígitos
}