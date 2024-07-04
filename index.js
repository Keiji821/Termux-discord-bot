const Discord = require('discord.js');
const client = new Discord.Client({ intents: 131071 });
const prefix = ','; // Prefix para los comandos
const fs = require('fs');
const readline = require('readline');
const git = require('simple-git')();

// Configuración de colores y decoraciones para la consola
const colors = {
reset: '[0m',
bright: '[1m',
dim: '[2m',
underscore: '[4m',
blink: '[5m',
reverse: '[7m',
hidden: '[8m',
fg: {
black: '[30m',
red: '[31m',
green: '[32m',
yellow: '[33m',
blue: '[34m',
magenta: '[35m',
cyan: '[36m',
white: '[37m',
},
bg: {
black: '[40m',
red: '[41m',
green: '[42m',
yellow: '[43m',
blue: '[44m',
magenta: '[45m',
cyan: '[46m',
white: '[47m',
},
};

// Decoraciones adicionales
const decorations = {
underline: '[4m',
bold: '[1m',
italic: '[3m',
};

// Función para mostrar mensaje de inicio
const startupMessage = () => {
console.log(`${colors.fg.green}${decorations.bold}El bot ${client.user.tag} se ha conectado correctamente!${colors.reset}`);
};

// Función para establecer el estado del bot
const setStatus = (status) => {
client.user.setPresence({ status });
};

// Función para establecer la actividad del bot
const setActivity = (text) => {
client.user.setActivity({ name: text, type: Discord.ActivityType.Playing });
};

// Manejador de comandos
const commandHandler = async (message) => {
try {
const args = message.content.slice(prefix.length).trim().split(/ +/);
const commandName = args.shift().toLowerCase();
let commandFile = null;

// Busca el archivo de comando en todas las carpetas
const folders = [
'anime',
'interacción',
'utilidades',
'herramientas',
'música',
'gestión',
'auto moderación',
'seguridad',
'moderación',
'administración',
];

for (const folder of folders) {
console.log(`${colors.fg.cyan}${decorations.italic}Buscando comando ${commandName} en carpeta ${folder}${colors.reset}`);
const folderPath = `./comandos/${folder}/${commandName}.js`;
if (fs.existsSync(folderPath)) {
commandFile = folderPath;
break;
}
}

// Si no se encuentra en ninguna carpeta, búsqueda en la carpeta raíz
if (!commandFile) {
console.log(`${colors.fg.cyan}${decorations.italic}Buscando comando ${commandName} en la carpeta raíz${colors.reset}`);
const rootPath = `./comandos/${commandName}.js`;
if (fs.existsSync(rootPath)) {
commandFile = rootPath;
}
}

console.log(`${colors.fg.green}${decorations.bold}Comando encontrado: ${commandFile}${colors.reset}`);

if (!commandFile) {
console.log(`${colors.fg.red}${decorations.bold}Comando no encontrado: ${commandName}${colors.reset}`);
return;
}
const command = require(commandFile);
if (!command.execute) {
console.log(`${colors.fg.yellow}${decorations.bold}El comando ${commandName} no tiene una función execute${colors.reset}`);
return;
}
await command.execute(message, args, client);
} catch (error) {
console.error(`${colors.fg.red}${decorations.bold}Error al ejecutar comando: ${error}${colors.reset}`);
message.reply(`Error al ejecutar comando: ${error}`);
}
};

// Eventos del bot
client.on('ready', async () => {
startupMessage();
setStatus('online');
setActivity('Bot oficial');
});

client.on('messageCreate', async (message) => {
if (message.author.bot) return;
if (!message.content.startsWith(prefix)) return;
commandHandler(message);
});

client.on('disconnect', () => {
console.log(`${colors.fg.red}${decorations.bold}El bot ${client.user.tag} se ha desconectado correctamente!${colors.reset}`);
});

client.on('error', (error) => {
console.error(`${colors.fg.red}${decorations.bold}Error: ${error}${colors.reset}`);
});

// Pedir token del bot al iniciar el archivo index.js
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
});

console.log(`${colors.fg.blue}${decorations.bold}Welcome to Termux Bot!${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.italic}Please select an option: ${colors.reset}`);
console.log(`${colors.fg.green}${decorations.bold}1. Start bot ${colors.reset}`);

console.log(`${colors.fg.red}${decorations.bold}2. Stop bot ${colors.reset}`);
console.log(`${colors.fg.yellow}${decorations.bold}3. Update code from GitHub repository ${colors.reset}`);

rl.question('Option: ', (option) => {
if (option === '1') {
console.log(`${colors.fg.green}${decorations.bold}Enter token to start bot: ${colors.reset}`);
rl.question('Token: ', (token) => {
client.login(token);
rl.close();
});
} else if (option === '2') {
console.log(`${colors.fg.red}${decorations.bold}Bot stopped ${colors.reset}`);
process.exit();
} else if (option === '3') {
console.log(`${colors.fg.yellow}${decorations.bold}Updating code from GitHub repository... ${colors.reset}`);