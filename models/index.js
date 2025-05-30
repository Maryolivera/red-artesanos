// models/index.js
const { Sequelize } = require('sequelize');
const UsuarioModel = require('./Usuario');
const AlbumModel   = require('./Album');

// Crea una conexión
const sequelize = new Sequelize('red_social','root','',{
  host: 'localhost',
  dialect: 'mariadb',
  logging: false
});

// Inicializa cada modelo con la conexion  

const Usuario = UsuarioModel(sequelize);
const Album   = AlbumModel(sequelize);

// Relaciones (un Usuario tiene muchos Álbumes)
Usuario.hasMany(Album, { foreignKey: 'usuarioId' });
Album.belongsTo(Usuario, { foreignKey: 'usuarioId' });



sequelize.sync()
  .then(() => console.log('✔️ Tablas sincronizadas'))
  .catch(e => console.error('❌ Error sincronizando tablas:', e));

  //exporta conexion y modelos
module.exports = { sequelize, Usuario,Album };


