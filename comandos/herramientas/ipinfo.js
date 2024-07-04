const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
name: 'ipinfo',
description: 'Obtiene información sobre una IP',
execute(message, args, client) {
if (!args[0]) {
return message.reply('Por favor, ingresa una IP válida');
}

const ip = args[0];
const apiUrl = `https://ipapi.co/${ip}/json/`;

axios.get(apiUrl)
.then(response => {
const json = response.data;

const color = getRandomColor(); // Genera un color aleatorio

const embed = new Discord.EmbedBuilder()
.setTitle(`Información de la IP ${ip}`)
.setColor(color) // Establece el color del embed
.setDescription(`
País: ${json.country}
Región: ${json.regionName}
Ciudad: ${json.city}
ISP: ${json.isp}
Organización: ${json.org}
Latitude: ${json.lat}
Longitude: ${json.lon}
Zona Horaria: ${json.timezone}
`)
.setFooter({ text: `Información proporcionada por IP-API` });

message.channel.send({ embeds: [embed] });
})
.catch(error => {
if (error.response) {
// La API devuelve un error
console.error(`Error ${error.response.status}: ${error.response.statusText}`);
message.reply(`Error al obtener la información de la IP: ${error.response.status} ${error.response.statusText}`);
} else {
// Error de conexión o otro tipo de error
console.error('Error al conectar a la API');
message.reply('Error al conectar a la API');
}
});
},
};

// Función para generar un color aleatorio
function getRandomColor() {
const colors = [
'00ff00', // Verde
'ff0000', // Rojo
'0000ff', // Azul
'ffff00', // Amarillo
'ff00ff', // Magenta
];
return `#${colors[Math.floor(Math.random() * colors.length)]}`;
}
