const Discord = require('discord.js');
const client = new Discord.Client({ intents: 131071 });
let prefixInput = ''; // Declarar variable para el prefijo
const fs = require('fs');
const readline = require('readline');
const git = require('simple-git')();

// Configuración de colores y decoraciones para la consola
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

// Decoraciones adicionales
const decorations = {
underline: '[4m',
bold: '[1m',
italic: '[3m',
};

//Función para mostrar mensaje de inicio
const startupMessage = () => {
console.log('[32m🟢 El bot ' + client.user.tag + ' se ha conectado correctamente! [0m');
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
console.log('[36mBuscando comando ' + commandName + ' en carpeta ' + folder + '[0m');
const folderPath = `./comandos/${folder}/${commandName}.js`;
if (fs.existsSync(folderPath)) {
commandFile = folderPath;
break;
}
}

// Si no se encuentra en ninguna carpeta, búsqueda en la carpeta raíz
if (!commandFile) {
console.log('[36mBuscando comando ' + commandName + ' en la carpeta raíz[0m');
const rootPath = `./comandos/${commandName}.js`;
if (fs.existsSync(rootPath)) {
commandFile = rootPath;
}
}

if (!commandFile) {
console.log('[31mComando no encontrado: ' + commandName + '[0m');
return;
}

const command = require(commandFile);
if (!command.execute) {
console.log('[33mEl comando ' + commandName + ' no tiene una función execute[0m');
return;
}

await command.execute(message, args, client, message.content.startsWith(prefix)? prefix : '');
} catch (error) {
console.error('[31mError al ejecutar comando: ' + error + '[0m');
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

process.stdout.write(`[48;2;35;40;40m`); // Fondo del menú

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

const updateCode = async () => {
try {
console.log(`[32mActualizando código...[0m`);
await exec('git pull origin main');
console.log(`[32mCódigo actualizado correctamente![0m`);
await exec('node index.js'); // Ejecutar el archivo index.js nuevamente
console.clear(); // Limpiar la consola
showMenu(); // Volver a mostrar el menú principal
} catch (error) {
console.error(`[31mError al actualizar código: ${error}[0m`);
}
};

const installDependencies = async () => {
try {
console.log(`[32mInstalando dependencias...[0m`);
await exec('npm install');
console.log(`[32mDependencias instaladas correctamente![0m`);
console.clear(); // Limpiar la consola
showMenu(); // Volver a mostrar el menú principal
} catch (error) {
console.error(`[31mError al instalar dependencias: ${error}[0m`);
}
};

const showMenu = () => {
console.clear(); // Limpiar la consola
console.log('[45m[37m          Termux Discord Bot          [0m');
console.log('[32m｜🪐 Hecho por: Keiji821[0m');
console.log('[36m⸂⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⸃[0m');
console.log('[32m▏[1] Iniciar bot             ︳[0m');
console.log('[36m▏[2] Actualizar              ︳[0m');
console.log('[33m▏[3] Instalar dependencias  ︳[0m');
console.log('[31m▏[4] Salir                   ︳[0m');
console.log('[36m⸌⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⸍[0m');
rl.setPrompt(`[32m [33m｜Opción➤ [0m`); // Establecer el texto de la casilla "Opción: "
rl.prompt(); // Mostrar la casilla "Opción:"
};

showMenu(); // Mostrar el menú principal al inicio

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
showMenu(); // Volver a mostrar el menú principal
}
});
}
});
break;
case '2':
updateCode();
showMenu(); // Volver a mostrar el menú principal
break;
case '3':
installDependencies();
showMenu(); // Volver a mostrar el menú principal
break;
case '4':
console.log(' Saliendo...');
process.exit();
break;
default:
console.log(' Opción inválida');
console.clear(); // Limpiar la consola
showMenu(); // Volver a mostrar el menú principal
}
}).on('close', () => {
process.exit();
});