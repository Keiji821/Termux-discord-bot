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
console.log(`  ${config.colors.fg.cyan}${config.decorations.bold}Termux Discord Bot${config.colors.reset}`);
console.log(``);
};

const printMenu = () => {
console.log(``);
console.log(`  ${config.colors.fg.white}Menú:`);
console.log(`  ${config.colors.fg.white}1. Iniciar bot`);
console.log(`  ${config.colors.fg.white}2. Configurar prefix`);
console.log(`  ${config.colors.fg.white}3. Actualizar código desde GitHub`);
console.log(`  ${config.colors.fg.white}4. Cerrar`);
console.log(``);
};

const handleOption1 = () => {
console.log(`${config.colors.fg.green}Ingresa el token de tu bot para initiarlo:`);
rl.question('Token: ', (token) => {
config.token = token;
client.login(token);
rl.close();
});
};

const handleOption2 = () => {
console.log(`${config.colors.fg.yellow}Configuración de prefix...`);
rl.question('Prefix: ', (newPrefix) => {
config.prefix = newPrefix;
console.log(`${config.colors.fg.green}Prefix actualizado correctamente!`);
rl.close();
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