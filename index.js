const Discord = require('discord.js');
const client = new Discord.Client({ intents: 131071 });
const prefix = ','; // Prefijo para los comandos
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

// Animaciones
const animation = {
loading: `\,x1b[34m■[0m`,
success: `[32m✔[0m`,
error: `[31m✖[0m`,
};

// Menú principal
console.log(``);
console.log(`${colors.fg.cyan}${decorations.bold}  _______  ${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.bold} /       \ ${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.bold}/         \${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.bold}|   Termux Bot   |${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.bold}\         /${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.bold} \       / ${colors.reset}`);
console.log(``);

// Pedir token del bot al iniciar el archivo index.js
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
});

console.log(`${colors.fg.blue}${decorations.bold}Bienvenido a Termux Bot!${colors.reset}`);
console.log(`${colors.fg.cyan}${decorations.italic}Por favor, selecciona una opción:${colors.reset}`);

rl.setPrompt(`${colors.fg.green}${decorations.bold}> ${colors.reset}`);

rl.question('Opción: ', (option) => {
if (option === '1') {
console.log(`${colors.fg.green}${decorations.bold}Ingresa el token de tu bot para initiarlo:${colors.reset}`);
rl.question('Token: ', (token) => {
client.login(token);
rl.close();
});
} else if (option === '2') {
console.log(`${colors.fg.yellow}${decorations.bold}Configuración de prefix...${colors.reset}`);
rl.question('Prefix: ', (newPrefix) => {
prefix = newPrefix;
console.log(`${colors.fg.green}${decorations.bold}Prefix actualizado correctamente!${colors.reset}`);
rl.close();
});
} else if (option === '3') {
console.log(`${colors.fg.yellow}${decorations.bold}Actualización de código desde el repositorio de GitHub...${colors.reset}`);
git.pull('origin', 'main', (err, update) => {
if (err) {
console.error(err);
} else {
console.log(`${colors.fg.green}${decorations.bold}Actualización exitosa!${colors.reset}`);
}
}).then(() => {
console.log(`${colors.fg.green}${decorations.bold}Actualización completa!${colors.reset}`);
rl.close();
}).catch((err) => {
console.error(err);
rl.close();
});
} else if (option === '4') {
console.log(`${colors.fg.red}${decorations.bold} ${animation.error} Cerrar${colors.reset}`);
process.exit();
}
});
