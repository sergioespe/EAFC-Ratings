const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/listadoJugadores.json'));
let allPlayers = data.items;
const term = "asdfghjkl".toLowerCase();
allPlayers = allPlayers.filter(player => 
  (player.commonName || '').toLowerCase().includes(term) ||
  (player.lastName || '').toLowerCase().includes(term) ||
  (player.firstName || '').toLowerCase().includes(term)
);
const paginatedItems = allPlayers.slice(0, 20);
console.log(paginatedItems.length);
