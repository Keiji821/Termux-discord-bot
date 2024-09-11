const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js'); 
const axios = require('axios');  
const namso = require('namso-cc-gen'); 

module.exports = {
  name: 'gen',
  description: 'Genera tarjetas de crédito aleatorias',
  async execute(interaction, args) {
    const input = args.join(' ');
    const parts = input.split('|');

    // Verifica que el formato de entrada sea correcto
    if (parts.length !== 4) {
      return interaction.reply('Error: Formato de entrada incorrecto. Uso: ,gen <bin>|<mes>|<año>|<ccv>');
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
      const response = await axios.get(`https://binchk-api.vercel.app/bin=${bin}`); 
      const json = response.data;

      if (!json.status) {
        throw new Error("No se encontraron datos para este BIN");
      }

      // Datos del BIN
      const bank = json.bank || 'Desconocido';
      const brand = json.brand || 'Desconocido';
      const type = json.type || 'Desconocido';
      const level = json.level || 'Desconocido';
      const phone = json.phone || 'Desconocido';

      // Generar las tarjetas de crédito
      const cards = generateCards(year, month, bin);

      // Crear embed con el botón de regenerar
      const cardEmbed = new EmbedBuilder()
        .setTitle('Generador de Tarjetas')
        .setColor('#0099ff')
        .addFields(
          { name: 'Formato', value: `${bin}|${month}|${year}`, inline: false },
          { name: 'Datos del BIN', value: `💳 ${brand} - ${type} - ${level}`, inline: false },
          { name: 'Datos del Banco', value: `🏦 ${bank} - Tel: ${phone}`, inline: false }
        )
        .addFields({ name: 'Tarjetas Generadas', value: cards.join('\n'), inline: false });

      // Crear botón de regenerar
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('regenerate')
          .setLabel('Regenerar Tarjetas')
          .setStyle(ButtonStyle.Primary)
      );

      // Enviar embed con botón
      await interaction.reply({ embeds: [cardEmbed], components: [row] });
    } catch (error) {
      console.error('Error al obtener datos de la API:', error.message);
      return interaction.reply('Error al generar tarjetas de crédito. Intente nuevamente más tarde.');
    }
  },

  // Manejar la interacción del botón de regenerar
  async interactionHandler(interaction) {
    if (interaction.customId === 'regenerate') {
      const args = interaction.message.embeds[0].fields[0].value.split('|');
      this.execute(interaction, args);
    }
  }
};

// Función para generar las tarjetas
function generateCards(year, month, bin) {
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

  // Asegurarse de que las tarjetas se generen correctamente
  const cards = res.split("|").filter(card => card && card.length >= 16);
  return cards.map(card => `${card}|${month}|${year}|${getRandomCCV()}`);
}

// Funciones auxiliares para generar valores aleatorios
function getRandomMonth() {
  const month = Math.floor(Math.random() * 12) + 1;
  return month.toString().padStart(2, '0'); 
}

function getRandomYear() {
  const currentYear = new Date().getFullYear();
  const year = currentYear + Math.floor(Math.random() * 5);
  return year.toString().slice(2); 
}

function getRandomCCV() {
  return Math.floor(100 + Math.random() * 900).toString(); 
}