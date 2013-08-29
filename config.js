module.exports = {
  debug: true,

  howManyDecks: 1,
  howManyPlayersMax: 6,
  startingStack: 500,
  penetrationRate: 0.75,

  dev: {
    port: process.env.PORT || 3000,
    client_port: process.env.CLIENT_PORT || process.env.PORT || 3000
  },

  prod: {
  	port: process.env.PORT || 3000, // Nodester port
    client_port: 80
  }
};