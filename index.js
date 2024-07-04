const Discord = require('discord.js');
const client = new Discord.Client({ intents: 131071 });
const prefix = ','; // Prefix para los comandos
const fs = require('fs');

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

const startupMessage = () => {
console.log(`${colors.fg.green}El bot ${client.user.tag} se ha conectado correctamente!${colors.reset}`);
};

const setStatus = (status) => {
client.user.setPresence({ status });
};

const setActivity = (text) => {
client.user.setActivity({ name: text, type: Discord.ActivityType.Playing });
};

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
console.log(`Buscando comando ${commandName} en carpeta ${folder}`);
const folderPath = `./comandos/${folder}/${commandName}.js`;
if (fs.existsSync(folderPath)) {
commandFile = folderPath;
break;
}
}

// Si no se encuentra en ninguna carpeta, búsqueda en la carpeta raíz
if (!commandFile) {
console.log(`Buscando comando ${commandName} en la carpeta raíz`);
const rootPath = `./comandos/${commandName}.js`;
if (fs.existsSync(rootPath)) {
commandFile = rootPath;
}
}

console.log(`commandFile: ${commandFile}`);

if (!commandFile) {
console.log(`${colors.fg.red}Comando no encontrado: ${commandName}${colors.reset}`);
return;
}
const command = require(commandFile);
if (!command.execute) {
console.log(`${colors.fg.yellow}El comando ${commandName} no tiene una función execute${colors.reset}`);
return;
}
await command.execute(message, args, client);
} catch (error) {
console.error(`${colors.fg.red}Error al ejecutar comando: ${error}${colors.reset}`);
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
console.log(`${colors.fg.red}El bot ${client.user.tag} se ha desconectado correctamente!${colors.reset}`);
});

client.on('error', (error) => {
console.error(`${colors.fg.red}Error: ${error}${colors.reset}`);
});

client.login('MTA0NTg3OTAxNjYzMDAwNTg0Mw.GEcFyc.gIzQlhOvjVm3At5JUPL1oV56MTJPLnBcWKmcwc');

// Agregué algunas funciones adicionales para mejorar la experiencia del usuario

client.on('guildCreate', (guild) => {
console.log(`${colors.fg.green}Se ha unido a un nuevo servidor: ${guild.name} (${guild.id})${colors.reset}`);
});

client.on('guildDelete', (guild) => {
console.log(`${colors.fg.red}Se ha eliminado de un servidor: ${guild.name} (${guild.id})${colors.reset}`);
});

client.on('messageReactionAdd', (reaction, user) => {
console.log(`${colors.fg.cyan}Reacción agregada: ${reaction.emoji.name} por ${user.tag} en ${reaction.message.channel.name}${colors.reset}`);
});

client.on('messageReactionRemove', (reaction, user) => {
console.log(`${colors.fg.cyan}Reacción eliminada: ${reaction.emoji.name} por ${user.tag} en ${reaction.message.channel.name}${colors.reset}`);
});