// models/index.js
const { Sequelize } = require('sequelize');
const UsuarioModel = require('./Usuario');

// Crea una conexión
const sequelize = new Sequelize('red_social','root','',{
  host: 'localhost',
  dialect: 'mariadb',
  logging: false
});

// Inicializa el modelo 

const Usuario = UsuarioModel(sequelize);


sequelize.sync()
  .then(() => console.log('✔️ Tablas sincronizadas'))
  .catch(e => console.error('❌ Error sincronizando tablas:', e));

module.exports = { sequelize, Usuario };


