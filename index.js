const Discord = require('discord.js');
const client = new Discord.Client({ intents: 131071 });

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

const decorations = {
underline: '[4m',
bold: '[1m',
italic: '[3m',
};

const startupMessage = () => {
console.log(`${colors.fg.green}${decorations.bold}El bot se ha conectado correctamente!${colors.reset}`);
};

const setStatus = (status) => {
client.user.setPresence({ status });
};

const setActivity = (text) => {
client.user.setActivity({ name: text, type: Discord.ActivityType.Playing });
};

// Agregamos la funcionalidad para especificar el prefix del bot
let prefix = process.argv[2] || ','; // Utilizamos el argumento pasado por la línea de comandos como prefix


const commandHandler = async (message) => {
try {
const args = message.content.slice(prefix.length).trim().split(/ +/);
const commandName = args.shift().toLowerCase();
let commandFile = null;

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
console.log(`${colors.fg.red}${decorations.bold}El bot se ha desconectado correctamente!${colors.reset}`);
});

client.on('error', (error) => {
console.error(`${colors.fg.red}${decorations.bold}Error: ${error}${colors.reset}`);
});


const printBanner = () => {
console.log(``);
console.log(`  ${colors.bg.blue}${colors.fg.white} Termux Discord Bot ${colors.reset}`);
console.log(``);
};

const printMenu = () => {
console.log(``);
console.log(`  ${colors.fg.white}Menú:`);
console.log(`  ${colors.fg.cyan}1. ${colors.fg.white}Iniciar bot`);
console.log(`  ${colors.fg.cyan}2. ${colors.fg.white}Actualizar código desde GitHub`);
console.log(`  ${colors.fg.cyan}3. ${colors.fg.white}Cerrar`);
console.log(``);
};

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
});

printBanner();
printMenu();

rl.question('Opción: ', (option) => {
if (option === '1') {
// Iniciar bot
client.login(process.env.TOKEN);
} else if (option === '2') {
// Actualizar código desde GitHub
} else if (option === '3') {
// Cerrar
process.exit(0);
} else {
console.log(`${colors.fg.red}Opción inválida. Intente nuevamente.`);
printMenu();
}
});


const exec = require('child_process').exec;

const updateCode = () => {
console.log(`${colors.fg.cyan}Actualizando código desde GitHub...`);
exec('git pull origin master', (error, stdout, stderr) => {
if (error) {
console.error(`Error al actualizar código: ${error}`);
return;
}
console.log(`${colors.fg.green}Código actualizado con éxito!`);
printMenu();
});
};

module.exports = {
client,
prefix,
};