const { Imagen, Usuario, ImagenCompartida,SolicitudAmistad,Comentario,Album } = require('../models');
const { Op } = require('sequelize');

exports.mostrarFormulario = async (req, res) => {
 const miId = req.session.usuarioId;
  //  lista de amigos (aceptadas, unidireccional):
  const relaciones = await SolicitudAmistad.findAll({
    where: { 
      estado: 'aceptada',
      [Op.or]: [
        { deId: miId },
        { paraId: miId }
      ]
    }
  });
  
  const amigoIds = relaciones.map(r =>
    r.deId === miId ? r.paraId : r.deId
  );
  // carga sólo esos usuarios:
  const usuarios = await Usuario.findAll({
    where: { id: { [Op.in]: amigoIds } },
    attributes: ['id','nombre']
  });
  const albums = await Album.findAll({
    where: { usuarioId: miId },
    attributes: ['id','titulo']
  })

  const imagen = await Imagen.findByPk(req.params.id);
  return res.render('compartir-form', {
    title: 'Compartir Imagen',
    usuarios,
    albums,
    imagen
  });
};


  exports.crearComentario = async (req, res) => {
  try {
    const autorId  = req.session.usuarioId;
    const imagenId = parseInt(req.params.id, 10);
    const { texto } = req.body;

    // 1) Crear comentario
    const comentario = await Comentario.create({
      texto,
      autorId,
      imagenId
    });

console.log('📝 Comentario guardado:', comentario.toJSON());
    
    const compartida = await ImagenCompartida.findOne({
      where: { imagenId }
    });
   
    const ownerId = compartida?.usuarioOrigenId;;   
   const imagen = await Imagen.findByPk(imagenId);
if (!imagen) return res.status(404).send('Imagen no encontrada');

const miniatura = imagen.ruta;


console.log('📷 Imagen encontrada. Usuario dueño:', ownerId)
    //  Emitir notificación
  req.io.to(`user-${ownerId}`).emit('imageComment', {
  imageId: imagenId,
  from: req.session.usuarioNombre,
  texto,
  miniatura: imagen.ruta 
});


    return res.redirect('/muro');
  } catch (err) {
    console.error('Error en crearComentario:', err);
    return res.status(500).send('❌ Error al crear comentario');
  }
};


exports.procesarCompartir = async (req, res) => {
  try {
    const usuarioOrigenId  = req.session.usuarioId;
    const imagenId         = parseInt(req.params.id, 10);
    const usuarioDestinoId = parseInt(req.body.usuarioDestinoId, 10);

    // Validación básica
    if (isNaN(usuarioDestinoId)) {
      return res.status(400).send('❌ Debes elegir un usuario destino');
    }

    // Crear el registro de imagen compartida
    await ImagenCompartida.create({
      imagenId,
      usuarioOrigenId,
      usuarioDestinoId
    });

    // Obtener el nombre del usuario origen
    const usuarioOrigen = await Usuario.findByPk(usuarioOrigenId);

    // Emitir notificación en tiempo real
    if (req.io) {
      req.io.to(`user-${usuarioDestinoId}`).emit('nuevaNotificacion', {
        mensaje: `${usuarioOrigen.nombre} te compartió una imagen.`
      });
    }

    res.redirect('/muro');
  } catch (e) {
    console.error('❌ Error en procesarCompartir:', e);
    res.status(500).send('❌ Error al compartir la imagen');
  }
};

