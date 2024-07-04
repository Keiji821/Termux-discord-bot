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

rl.setPrompt(`${config.colors.fg.green}${config.decorations.bold}> ${config.colors.reset}`);

const printMenu = () => {
console.log(``);
console.log(`${config.colors.fg.cyan}${config.decorations.bold}
████████████████████████████████████████████████████████████████████
${config.colors.reset}`);
console.log(`${config.colors.fg.cyan}${config.decorations.bold}
█                                                                                      █
${config.colors.reset}`);
console.log(`${config.colors.fg.cyan}${config.decorations.bold}
█  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█
${config.colors.reset}`);
console.log(`${config.colors.fg.cyan}${config.decorations.bold}
█  █       █       █       █       █       █       █       █       █
${config.colors.reset}`);
console.log(`${config.colors.fg.cyan}${config.decorations.bold}
█  █  1️⃣  █  Iniciar       █  2️⃣  █  Configurar  █  3️⃣  █  Actualizar   █  4️⃣  █  Cerrar
${config.colors.reset}`);
console.log(`${config.colors.fg.cyan}${config.decorations.bold}
█  █       █       █       █       █       █       █       █       █
${config.colors.reset}`);
console.log(`${config.colors.fg.cyan}${config.decorations.bold}
█  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
█
${config.colors.reset}`);
console.log(`${config.colors.fg.cyan}${config.decorations.bold}
█                                                                                      █
${config.colors.reset}`);
console.log(`${config.colors.fg.cyan}${config.decorations.bold}
████████████████████████████████████████████████████████████████████
${config.colors.reset}`);
console.log(``);
};

const handleOption1 = () => {
console.log(`${config.colors.fg.green}${config.decorations.bold}Ingresa el token de tu bot para initiarlo:${config.colors.reset}`);
rl.question('Token: ', (token) => {
config.token = token;
client.login(token);
rl.close();
});
};

const handleOption2 = () => {
console.log(`${config.colors.fg.yellow}${config.decorations.bold}Configuración de prefix...${config.colors.reset}`);
rl.question('Prefix: ', (newPrefix) => {
config.prefix = newPrefix;
console.log(`${config.colors.fg.green}${config.decorations.bold}Prefix actualizado correctamente!${config.colors.reset}`);
rl.close();
});
};

const handleOption3 = () => {
console.log(`${config.colors.fg.yellow}${config.decorations.bold}Actualización de código desde el repositorio de GitHub...${config.colors.reset}`);
git.pull('origin', 'main', (err, update) => {
if (err) {
console.error(`Error updating code: ${err}`);
} else {
console.log(`${config.colors.fg.green}${config.decorations.bold}Actualización exitosa!${config.colors.reset}`);
}
}).then(() => {
console.log(`${config.colors.fg.green}${config.decorations.bold}Actualización completa!${config.colors.reset}`);
rl.close();
}).catch((err) => {
console.error(`Error updating code: ${err}`);
rl.close();
});
};

const handleOption4 = () => {
console.log(`${config.colors.fg.red}${config.decorations.bold} Cerrar${config.colors.reset}`);
process.exit();
};

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
console.log(`${config.colors.fg.red}${config.decorations.bold}Opción no válida${config.colors.reset}`);
printMenu();
break;
}
});