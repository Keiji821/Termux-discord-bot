const Discord = require('discord.js');
const client = new Discord.Client({ intents: 131071 });
const fs = require('fs');
const readline = require('readline');
const git = require('simple-git')();
const config = require('./config');

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
});

const printBanner = () => {
console.log(``);
console.log(`  ${config.colors.bg.blue}${config.colors.fg.white} Termux Discord Bot ${config.colors.reset}`);
console.log(``);
};

const printMenu = () => {
console.log(``);
console.log(`  ${config.colors.fg.white}Menú:`);
console.log(`  ${config.colors.fg.cyan}1. ${config.colors.fg.white}Iniciar bot`);
console.log(`  ${config.colors.fg.cyan}2. ${config.colors.fg.white}Configurar prefix`);
console.log(`  ${config.colors.fg.cyan}3. ${config.colors.fg.white}Actualizar código desde GitHub`);
console.log(`  ${config.colors.fg.cyan}4. ${config.colors.fg.white}Cerrar`);
console.log(``);
};

const handleOption1 = () => {
console.log(`${config.colors.fg.green}Ingresa el token de tu bot para initiarlo:`);
rl.question('Token: ', (token) => {
config.token = token;
client.login(token);
rl.close();
printMenu();
});
};

const handleOption2 = () => {
console.log(`${config.colors.fg.yellow}Configuración de prefix...`);
rl.question('Prefix: ', (newPrefix) => {
config.prefix = newPrefix;
console.log(`${config.colors.fg.green}Prefix actualizado correctamente!`);
rl.close();
printMenu();
});
};

const handleOption3 = () => {
console.log(`${config.colors.fg.yellow}Actualizando código desde GitHub...`);
git.pull('origin', 'main', (err, update) => {
if (err) {
console.error(`Error updating code: ${err}`);
} else {
console.log(`${config.colors.fg.green}Actualización exitosa!`);
}
}).then(() => {
console.log(`${config.colors.fg.green}Actualización completa!`);
process.stdout.write(''); // Beaver beep
require('./index.js'); // Restart script
printMenu();
}).catch((err) => {
console.error(`Error updating code: ${err}`);
});
};

const handleOption4 = () => {
console.log(`${config.colors.fg.red} Cerrar`);
process.exit();
};

printBanner();
printMenu();

rl.question('Opción: ', (option) => {
switch (option) {
case '1':
handleOption1();
break;
case '2':
handleOption2();
break;
case '3':
handleOption3();
break;
case '4':
handleOption4();
break;
default:
console.log(`${config.colors.fg.red}Opción no válida`);
printMenu();
break;
}
});