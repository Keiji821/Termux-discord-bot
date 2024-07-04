const Discord = require('discord.js');
const client = new Discord.Client({ intents: 131071 });
let prefixInput = ''; // Declarar variable para el prefijo
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
const commandHandler = async (message, prefix) => {
try {
if (!message.content.startsWith(prefix)) return;
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

if (!commandFile) {
console.log(`${colors.fg.red}${decorations.bold}Comando no encontrado: ${commandName}${colors.reset}`);
return;
}

const command = require(commandFile);
if (!command.execute) {
console.log(`${colors.fg.yellow}${decorations.bold}El comando ${commandName} no tiene una función execute${colors.reset}`);
return;
}
await command.execute(message, args, client, message.content.startsWith(prefix)? prefix : '');
} catch (error) {
console.error(`${colors.fg.red}${decorations.bold}Error al ejecutar comando: ${error}${colors.reset}`);
message.reply(`Error al ejecutar comando: ${error}`);
}
};

client.on('ready', async () => {
startupMessage();
setStatus('online');
setActivity('Bot oficial');
});

client.on('messageCreate', async (message) => {
if (message.author.bot) return;
commandHandler(message, prefixInput);
});

client.on('disconnect', () => {
console.log(`${colors.fg.red}${decorations.bold}El bot ${client.user.tag} se ha desconectado correctamente!${colors.reset}`);
});

client.on('error', (error) => {
console.error(`${colors.fg.red}${decorations.bold}Error: ${error}${colors.reset}`);
});


// Función para actualizar código desde GitHub
const updateCode = async () => {
try {
await git.pull('origin', 'main');
console.log(`${colors.fg.green}${decorations.bold}Código actualizado correctamente!${colors.reset}`);
process.exit(); // Reiniciar el proceso para que se cargue el nuevo código
} catch (error) {
console.error(`${colors.fg.red}${decorations.bold}Error al actualizar código: ${error}${colors.reset}`);
}
};

// Leer entrada del usuario
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

// Mostrar menú principal
const showMenu = () => {
console.clear(); // Limpiar la consola
console.log(`${colors.fg.cyan}${decorations.bold}  _______ ${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.bold} /      \ ${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.bold}|  Termux  | ${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.bold}|  Discord  | ${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.bold}|  Bot        | ${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.bold} \      / ${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.bold}  _______ ${colors.reset}`);
console.log(`${colors.fg.white}${decorations.bold} Seleccione una opción: ${colors.reset}`);
console.log(`${colors.fg.white}1. Inicializar bot${colors.reset}`);
console.log(`${colors.fg.white}2. Actualizar código${colors.reset}`);
console.log(`${colors.fg.white}3. Salir${colors.reset}`);
};

// Mostrar menú principal
showMenu();

// Leer opción del usuario
rl.question('Opción: ', (option) => {
switch (option) {
case '1':
console.log('Ingrese el token del bot: ');
rl.question('Token: ', (token) => {
client.login(token);
console.log('Ingrese el prefijo del bot: ');
rl.question('Prefijo: ', (prefix) => {
prefixInput = prefix;
});
});
break;
case '2':
updateCode();
break;
case '3':
console.log(`${colors.fg.red}${decorations.bold}Saliendo...${colors.reset}`);
process.exit();
break;
default:
console.log(`${colors.fg.red}${decorations.bold}Opción inválida${colors.reset}`);
showMenu();
}
});



// Servidor HTTP
