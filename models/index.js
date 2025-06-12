// models/index.js
const { Sequelize, DataTypes } = require('sequelize');

// Crea una conexión
const sequelize = new Sequelize('red_social','root','',{
  host: 'localhost',
  dialect: 'mariadb',
  logging: false
});

const UsuarioModel = require('./Usuario');
const AlbumModel   = require('./Album');
const ImagenModel     = require('./Imagen');
const ImagenCompartidaModel = require('./ImagenCompartida');
const SolicitudAmistadModel=require('./SolicitudAmistad');


const ImagenCompartida = ImagenCompartidaModel(sequelize, DataTypes);
const SolicitudAmistad = SolicitudAmistadModel(sequelize, DataTypes);




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

  as:'imagenes'
});
Imagen.belongsTo(Album, { foreignKey: 'albumId',as:'album' });


// Una imagen puede compartirse muchas veces:
Imagen.hasMany(ImagenCompartida, {
  foreignKey: 'imagenId',
  as: 'compartidas'
});
// Cada “share” pertenece a una imagen:
ImagenCompartida.belongsTo(Imagen, {
  foreignKey: 'imagenId',
  as: 'imagen'
});

// Un usuario (origen) comparte muchas imágenes:
Usuario.hasMany(ImagenCompartida, {
  foreignKey: 'usuarioOrigenId',
  as: 'enviosCompartidos'
});
ImagenCompartida.belongsTo(Usuario, {
  foreignKey: 'usuarioOrigenId',
  as: 'origen'
});

// Un usuario (destino) recibe muchas imágenes compartidas:
Usuario.hasMany(ImagenCompartida, {
  foreignKey: 'usuarioDestinoId',
  as: 'recibidasCompartidas'
});
ImagenCompartida.belongsTo(Usuario, {
  foreignKey: 'usuarioDestinoId',
  as: 'destino'
});


// Un usuario puede compartir muchas imágenes (origen)
// y una imagen puede ser compartida por muchos usuarios.
Usuario.belongsToMany(Imagen, {
  through: ImagenCompartida,
  as: 'imágenesCompartidasPorMi',
  foreignKey: 'usuarioOrigenId',
  otherKey: 'imagenId'
});

// Un usuario puede recibir muchas imágenes compartidas (destino)
// y una imagen puede ir a muchos destinos.
Usuario.belongsToMany(Imagen, {
  through: ImagenCompartida,
  as: 'imágenesCompartidasConmigo',
  foreignKey: 'usuarioDestinoId',
  otherKey: 'imagenId'
});

// Opcionalmente, para navegar desde la imagen:
Imagen.belongsToMany(Usuario, {
  through: ImagenCompartida,
  as: 'compartidaCon',
  foreignKey: 'imagenId',
  otherKey: 'usuarioDestinoId'
});

// Asociaciones:
Usuario.hasMany(SolicitudAmistad, { foreignKey: 'deId',   as: 'solicitudesEnviadas' });
SolicitudAmistad.belongsTo(Usuario, { foreignKey: 'deId',   as: 'origen' });

Usuario.hasMany(SolicitudAmistad, { foreignKey: 'paraId', as: 'solicitudesRecibidas' });
SolicitudAmistad.belongsTo(Usuario, { foreignKey: 'paraId', as: 'destino' });



sequelize.sync()
  .then(() => console.log('✔️ Tablas sincronizadas'))
  .catch(e => console.error('❌ Error sincronizando tablas:', e));

  //exporta conexion y modelos
module.exports = { sequelize, Usuario,Album ,Imagen,ImagenCompartida , SolicitudAmistad}


