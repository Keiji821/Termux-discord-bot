const Discord = require('discord.js');
const net = require('net');
const dns = require('dns');
const axios = require('axios');
const os = require('os');
const childProcess = require('child_process');


const SCAN_TIMEOUT = 5000;

module.exports = {
name: 'scan',
description: 'Realiza un escaneo de puertos, hosts, URLs, sistema y red',
async execute(message, args, client) {
if (!args[0]) {
return message.reply('Por favor, ingresa una dirección IP o un dominio');
}

const target = args[0];
const results = {};

// Escaneo de puertos
const portScan = async () => {
const ports = [];
for (let port = 1; port <= 1024; port++) {
const socket = new net.Socket();
socket.connect(port, target, () => {
ports.push(port);
socket.destroy();
});
}
await new Promise(resolve => setTimeout(resolve, SCAN_TIMEOUT));
return ports;
};

// Escaneo de hosts
const hostScan = async () => {
try {
const addresses = await dns.promises.resolve(target);
return addresses;
} catch (err) {
return [`No se encontró un registro DNS para ${target}`];
}
};

// Escaneo de URLs
const urlScan = async () => {
try {
await axios.head(`https://${target}`);
return [`https://${target}`];
} catch (error) {
return [`No se encontró la URL ${target}`];
}
};

// Escaneo de sistema
const osScan = async () => {
const osInfo = {
platform: os.platform(),
arch: os.arch(),
release: os.release(),
};
return osInfo;
};

// Escaneo de procesos
const processScan = async () => {
try {
const stdout = await childProcess.exec('tasklist');
const processList = stdout.split('');
return processList.map(process => process.trim());
} catch (error) {
return [`No se pudo obtener la lista de procesos`];
}
};

// Escaneo de red
const networkScan = async () => {
try {
const stdout = await childProcess.exec('ipconfig');
const networkInfo = stdout.split('');
return networkInfo.map(line => line.trim());
} catch (error) {
return [`No se pudo obtener la información de la red`];
}
};
  const [ports, hosts, urls, osInfo, processes, networkInfo] = await Promise.all([
portScan(),
hostScan(),
urlScan(),
osScan(),
processScan(),
networkScan(),
]);

results.ports = ports;
results.hosts = hosts;
results.urls = urls;
results.os = osInfo;
results.processes = processes;
results.network = networkInfo;

const embed = new Discord.EmbedBuilder()
.setTitle(`Escaneo de ${target}`)
.setDescription(`
Puertos abiertos: ${results.ports.join(', ')}
Hosts resueltos: ${results.hosts.join(', ')}
URLs disponibles: ${results.urls.join(', ')}
Sistema operativo: ${results.os.platform} ${results.os.arch} ${results.os.release}
Procesos en ejecución: ${results.processes.join(', ')}
Información de la red: ${results.network.join(', ')}
`)
.setColor(getRandomColor())
.setFooter({
text: `Escaneo realizado por ${client.user.username} • ${new Date().toLocaleString()}`,
});

message.channel.send({ embeds: [embed] });
},
};

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
