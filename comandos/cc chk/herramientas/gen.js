const Discord = require('discord.js');
const axios = require('axios');
const namso = require('namso-cc-gen');

module.exports = {
  name: 'gen',
  description: 'Genera tarjetas de crédito aleatorias',
  execute(message, args, client) {
    // Unir los argumentos en una sola cadena
    const input = args.join(' ');
    // Dividir la cadena en partes usando el delimitador '|'
    const parts = input.split('|');

    // Variables para almacenar los datos de la tarjeta
    let bin, year, month, ccv;

    // Validar la cantidad de partes en la entrada
    if (parts.length === 1) {
      bin = parts[0];
      // Si solo hay un BIN, asignar valores aleatorios para el resto
      year = getRandomYear();
      month = getRandomMonth();
      ccv = getRandomCCV();
    } else if (parts.length === 4) {
      // Si hay cuatro partes, usarlas directamente o generar valores aleatorios si es necesario
      bin = parts[0];
      month = parts[1] === 'rnd' || parts[1] === 'xxx' ? getRandomMonth() : parts[1];
      year = parts[2] === 'rnd' || parts[2] === 'xxx' ? getRandomYear() : parts[2];
      ccv = parts[3] === 'rnd' || parts[3] === 'xxx' ? getRandomCCV() : parts[3];
    } else {
      // Mensaje de error si el formato es incorrecto
      return message.channel.send('Error: Formato de entrada incorrecto. Uso: ,gen <bin> o ,gen <bin>|<mes>|<año>|<ccv>');
    }

    // Consultar la API para obtener datos del BIN
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

  const cards = res.split("|"); // Divide la cadena en un array de tarjetas

  if (cards.length > 0) {
    const cardEmbed = new Discord.EmbedBuilder()
      .setTitle('Tarjetas de Crédito Generadas')
      .setColor('#0099ff');

    let fields = [];

    if (bank) {
      fields.push({ name: 'Banco', value: bank, inline: true });
    }
    if (country) {
      fields.push({ name: 'País', value: country, inline: true });
    }

    // Usar el CCV proporcionado por el usuario
    const cardDescription = cards.map(card => {
      return `${card} | CCV: ${ccv}`;
    }).join('\n'); // Cambiar ' ' por '\n' para saltos de línea

    cardEmbed.addFields(fields);
    cardEmbed.setDescription(cardDescription);

    message.channel.send({ embeds: [cardEmbed] });
  } else {
    message.channel.send('No se pudieron generar las tarjetas de crédito.');
  }
}

function getRandomBin() {
  // Implementa esta función para devolver un BIN aleatorio
}

function getRandomYear() {
  // Implementa esta función para devolver un año aleatorio
}

function getRandomMonth() {
  // Implementa esta función para devolver un mes aleatorio
}

function getRandomCCV() {
  // Implementa esta función para devolver un CCV aleatorio
}