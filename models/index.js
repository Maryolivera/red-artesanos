require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('❌  La variable de entorno DATABASE_URL no está definida');
}

// Crea la instancia de Sequelize
const sequelize = new Sequelize(connectionString, {
  dialect: 'mysql',
  protocol: 'mysql',
  logging: false,
  dialectOptions: {
    
    
  }
});



const UsuarioModel = require('./Usuario');
const AlbumModel   = require('./Album');
const ImagenModel     = require('./Imagen');
const ComentarioModel = require('./comentario');
const ImagenCompartidaModel = require('./ImagenCompartida');
const SolicitudAmistadModel=require('./SolicitudAmistad');



const ImagenCompartida = ImagenCompartidaModel(sequelize, DataTypes);
const SolicitudAmistad = SolicitudAmistadModel(sequelize, DataTypes);
const Usuario = UsuarioModel(sequelize,DataTypes);
const Album   = AlbumModel(sequelize,DataTypes);
const Imagen  = ImagenModel(sequelize,DataTypes);
const Comentario = ComentarioModel(sequelize,DataTypes);

//—– Asociaciones Usuario - Album
Usuario.hasMany(Album,    { foreignKey: 'usuarioId', as: 'albums' });
Album.belongsTo(Usuario,  { foreignKey: 'usuarioId', as: 'usuario' });

// —– Album - Imagen
Album.hasMany(Imagen,     { foreignKey: 'albumId',    as: 'imagenes' });
Imagen.belongsTo(Album,   { foreignKey: 'albumId',    as: 'album' });

// —– ImagenCompartida (registra quién comparte qué con quién)
Usuario.hasMany(ImagenCompartida,   { foreignKey: 'usuarioOrigenId',  as: 'compartidasOri' });
ImagenCompartida.belongsTo(Usuario, { foreignKey: 'usuarioOrigenId',  as: 'origen' });

// usuarioDestinoId  Usuario “destino”
Usuario.hasMany(ImagenCompartida,   { foreignKey: 'usuarioDestinoId', as: 'compartidasDest' });
ImagenCompartida.belongsTo(Usuario, { foreignKey: 'usuarioDestinoId', as: 'destino' });

// imagenId -Imagen
Imagen.hasMany(ImagenCompartida,    { foreignKey: 'imagenId',        as: 'comparticiones' });
ImagenCompartida.belongsTo(Imagen,  { foreignKey: 'imagenId',        as: 'imagen' });

// —– Comentarios
Usuario.hasMany(Comentario,   { foreignKey: 'autorId',   as: 'comentarios' });
Comentario.belongsTo(Usuario, { foreignKey: 'autorId',   as: 'autor' });

Imagen.hasMany(Comentario,    { foreignKey: 'imagenId',  as: 'comentarios' });
Comentario.belongsTo(Imagen,  { foreignKey: 'imagenId',  as: 'imagen' });

// —– SolicitudAmistad (quién envía / quién recibe)
Usuario.hasMany(SolicitudAmistad,    { foreignKey: 'deId',   as: 'solicitudesEnviadas' });
SolicitudAmistad.belongsTo(Usuario,  { foreignKey: 'deId',   as: 'origen' });

Usuario.hasMany(SolicitudAmistad,    { foreignKey: 'paraId', as: 'solicitudesRecibidas' });
SolicitudAmistad.belongsTo(Usuario,  { foreignKey: 'paraId', as: 'destino' });




module.exports = { sequelize, Usuario,Album ,Imagen,ImagenCompartida , SolicitudAmistad,Comentario}


