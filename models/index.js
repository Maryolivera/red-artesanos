// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const UsuarioModel = require('./Usuario');
const AlbumModel   = require('./Album');
const ImagenModel     = require('./Imagen');

// Crea una conexión
const sequelize = new Sequelize('red_social','root','',{
  host: 'localhost',
  dialect: 'mariadb',
  logging: false
});

// Inicializa cada modelo con la conexion  

const Usuario = UsuarioModel(sequelize,DataTypes);
const Album   = AlbumModel(sequelize,DataTypes);
const Imagen  = ImagenModel(sequelize,DataTypes);

// (un Usuario tiene muchos Álbumes)
Usuario.hasMany(Album, { 
  foreignKey: 'usuarioId',
  sourceKey:'id'
})

 
Album.belongsTo(Usuario, { foreignKey: 'usuarioId',targetKey:'id' });
//  Un Álbum tiene muchas Imágenes
Album.hasMany(Imagen, { 
  foreignKey: 'albumId' ,
  sourceKey:'id',
  as:'imagenes'
});
Imagen.belongsTo(Album, { foreignKey: 'albumId',targetKey:'id',as:'imagenes' });




sequelize.sync()
  .then(() => console.log('✔️ Tablas sincronizadas'))
  .catch(e => console.error('❌ Error sincronizando tablas:', e));

  //exporta conexion y modelos
module.exports = { sequelize, Usuario,Album ,Imagen};


