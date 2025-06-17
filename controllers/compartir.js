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

    
    const imagen = await Imagen.findByPk(imagenId);
   
    const ownerId = imagen.usuarioId;   

    //  Emitir notificación
    const excerpt = texto.length > 30
      ? texto.slice(0, 30) + '…'
      : texto;
    req.io.to(`user-${ownerId}`).emit('imageComment', {
      imageId: imagenId,
      from:    req.session.usuarioNombre,
      excerpt
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

    // validación básica
    if (isNaN(usuarioDestinoId)) {
      return res.status(400).send('❌ Debes elegir un usuario destino');
    }

  
    
    await ImagenCompartida.create({
      imagenId,
      usuarioOrigenId,
      usuarioDestinoId
    });

    if (req.io) {
      req.io.to(`user-${usuarioDestinoId}`)
        .emit('imageShared', { imagenId, from: usuarioOrigenId });
    }

    res.redirect('/muro');
  } catch (e) {
    console.error(e);
    res.status(500).send('❌ Error al compartir la imagen');
  }
};
