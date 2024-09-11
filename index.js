const Discord = require('discord.js');
const client = new Discord.Client({ intents: 131071 });
let prefixInput = '';
const fs = require('fs');
const readline = require('readline');
const git = require('simple-git')();
var figlet = require("figlet");
const lolcatjs = require('lolcatjs');

lolcatjs.options.seed = Math.round(Math.random() * 1000);
lolcatjs.options.colors = true;

const colors = {
reset: '[0m',
bright: '[1m',
dim: '[2m',
underscore: '[4m',
blink: '[5m',
reverse: '[7m',
hidden: '[8m',
fg: {
black: '[30m',
red: '[31m',
green: '[32m',
yellow: '[33m',
blue: '[34m',
magenta: '[35m',
cyan: '[36m',
white: '[37m',
},
bg: {
black: '[40m',
red: '[41m',
green: '[42m',
yellow: '[43m',
blue: '[44m',
magenta: '[45m',
cyan: '[46m',
white: '[47m',
},
};

const decorations = {
underline: '[4m',
bold: '[1m',
italic: '[3m',
};

// Mostrar mensaje de inicio
const startupMessage = () => {
console.log('[32m[1m 「🟢」 El bot ' + client.user.tag + ' se ha conectado correctamente! [0m');
};

// Establecer el estado del bot
const setStatus = (status) => {
client.user.setPresence({ status });
};

// Establecer la actividad del bot
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
'cc chk',
];

for (const folder of folders) {
if (folder === 'cc chk') {
console.log('[36m Buscando comando ' + commandName + ' en carpeta ' + folder + '/herramientas[36m');
const folderPath = `./comandos/${folder}/herramientas/${commandName}.js`;
if (fs.existsSync(folderPath)) {
commandFile = folderPath;
break;
}
} else {
console.log('[36m Buscando comando ' + commandName + ' en carpeta ' + folder + '[36m');
const folderPath = `./comandos/${folder}/${commandName}.js`;
if (fs.existsSync(folderPath)) {
commandFile = folderPath;
break;
}
}
}


// Si no se encuentra en ninguna carpeta, búsqueda en la carpeta raíz
if (!commandFile) {
console.log('[36m Buscando comando ' + commandName + ' en la carpeta raíz[0m');
const rootPath = `./comandos/${commandName}.js`;
if (fs.existsSync(rootPath)) {
commandFile = rootPath;
}
}

if (!commandFile) {
console.log('[31m Comando no encontrado: ' + commandName + '[0m');
return;
}

const command = require(commandFile);
if (!command.execute) {
console.log('[33m El comando ' + commandName + ' no tiene una función execute[0m');
return;
}

await command.execute(message, args, client, message.content.startsWith(prefix)? prefix : '');
} catch (error) {
console.error('[31m Error al ejecutar comando: ' + error + '[0m');
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



const { exec } = require('child_process');

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

const updateCode = async () => {
try {
console.log(`[32m Actualizando código...[0m`);
await exec('git pull origin main');
console.log(`[32m Código actualizado correctamente![0m`);
await exec('node index.js');
console.clear(); 
showMenu(); 
} catch (error) {
console.error(`[31m Error al actualizar código: ${error}[0m`);
}
};

const installDependencies = async () => {
try {
console.log(`[32m[31m Instalando dependencias...[0m`);
await exec('npm install discord.js');
console.log(`[32m[31m Dependencias instaladas correctamente![0m`);
console.clear();
showMenu();
} catch (error) {
console.error(`[31m[1m Error al instalar dependencias: ${error}[0m`);
}
};

const showMenu = () => {
  console.clear();

lolcatjs.fromString(
  figlet.textSync("DisBot", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  })
);

lolcatjs.fromString('    Hecho por: Keiji821');

lolcatjs.fromString();
lolcatjs.fromString('

⸂⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⸃
▏[1] Iniciar bot             ︳
▏[2] Actualizar              ︳
▏[3] Instalar dependencias   ︳
▏[4] Salir                   ︳
⸌⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⸍');
lolcatjs.fromString();

rl.setPrompt(`[32m[1m  ➤ `);
lolcatjs.fromString();
rl.prompt(); 
};

showMenu();

rl.on('line', (option) => {
switch (option.trim()) {
case '1':
console.log('Ingrese el token del bot: ');
rl.question('Token: ', (token) => {
if (token === '') {
console.log('Token invalido');
showMenu();
} else {
client.login(token);
console.log('Ingrese el prefijo del bot: ');
rl.question('Prefijo: ', (prefix) => {
if (prefix === '') {
console.log('Prefix invalido');
showMenu();
} else {
prefixInput = prefix;
showMenu();
}
});
}
});
break;
case '2':
updateCode();
showMenu();
break;
case '3':
installDependencies();
showMenu();
break;
case '4':
console.log(' Saliendo...');
process.exit();
break;
default:
console.log(' Opción inválida');
console.clear();
showMenu();
}
}).on('close', () => {
process.exit();
});