const { SolicitudAmistad, Usuario,Album,ImagenCompartida,Imagen } = require('../models');
const { Op } = require('sequelize');

exports.aceptarSolicitud = async (req, res) => {
  const solicitudId = parseInt(req.params.id, 10);

  //Buscamos la solicitud
  const solicitud = await SolicitudAmistad.findByPk(solicitudId);
  if (!solicitud) {
    return res.status(404).send('Solicitud no encontrada');
  }

  //  La marcamos como aceptada
  solicitud.estado = 'aceptada';
  await solicitud.save();

  //  Obtenemos datos del usuario que acaba de aceptar (para el título)
  const usuarioAcepta = await Usuario.findByPk(solicitud.paraId);
   
   const fronName = usuarioAcepta.nombre; 

  //  Creamos un álbum en el perfil del que envió la solicitud
  const nuevoAlbum = await Album.crearAlbum({
    titulo: `${usuarioAcepta.nombre} ${usuarioAcepta.apellido}`,
    usuarioId: solicitud.deId
  });

  //  todas las imágenes que el usuarioAcepta compartió con el solicitante
  const compartidas = await ImagenCompartida.findAll({
    where: {
      usuarioOrigenId: solicitud.paraId,
      usuarioDestinoId: solicitud.deId
    }
  });

  //  Asociamos esas imágenes al nuevo álbum
  
  await Promise.all(compartidas.map(c => {
    return Imagen.update(
      { albumId: nuevoAlbum.id },
      { where: { id: c.imagenId } }
    );
  }));

  //  Notificamos la solicitud de que fue aceptada
  req.io
    .to(`user-${solicitud.deId}`)
    .emit('friendRequestResponse', {
      requestId: solicitudId,
      accepted: true,
      fronName
    });
    res.redirect('/muro');

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.json({ ok: true });
  }
    res.redirect('/muro');
 
};




exports.listarSolicitudesRecibidas = async (req, res) => {
  const usuarioId = req.session.usuarioId;
  const solicitudes = await SolicitudAmistad.findAll({
    where: { paraId: usuarioId, estado: 'pendiente' },
    include: [{
      model: Usuario,
      as: 'origen',
      attributes: ['id','nombre']
    }]
  });
  res.render('friend-list', {
    title: 'Solicitudes de amistad',
    solicitudes
  });
};

exports.listarSolicitudesEnviadas = async (req, res) => {
  const usuarioId = req.session.usuarioId;
  const solicitudes = await SolicitudAmistad.findAll({
    where: { deId: usuarioId, estado: 'pendiente' },
    include: [{
      model: Usuario,
      as: 'destino',
      attributes: ['id','nombre']
    }]
  });
  res.render('friend-sent', {
    title: 'Solicitudes enviadas',
    solicitudes
  });
};

exports.listarAmigos = async (req, res) => {
  const usuarioId = req.session.usuarioId;
  const aceptadas = await SolicitudAmistad.findAll({
    where: {
      estado: 'aceptada',
      [Op.or]: [
        { deId: usuarioId },
        { paraId: usuarioId }
      ]
    }
  });
  const amigoIds = aceptadas.map(sol =>
    sol.deId === usuarioId ? sol.paraId : sol.deId
  );
  const amigos = await Usuario.findAll({ where: { id: amigoIds } });
  res.render('friend-list-all', {
    title: 'Mis amigos',
    amigos
  });
};

exports.mostrarFormulario = async (req, res) => {
  console.log('SESSION usuarioId:', req.session.usuarioId);
  const usuarioId = req.session.usuarioId;
  const usuarios = await Usuario.findAll({
    where: { id: { [Op.ne]: usuarioId } }
  });
  res.render('friend-new', {
    title: 'Enviar solicitud de amistad',
    usuarios
  });
};


 exports.enviarSolicitud = async (req, res) => {
  const deId   = req.session.usuarioId;
  const paraId = parseInt(req.body.paraId, 10);

  console.log(`[CONTROLLER] enviarSolicitud: de ${deId} a ${paraId}`);

  const nueva = await SolicitudAmistad.create({ deId, paraId });

 console.log(`[SOCKET] emitiendo friendRequest a user-${paraId}`);
  req.io.to(`user-${paraId}`).emit('friendRequest', {
    from: { id: deId, nombre: req.session.usuarioNombre },
    requestId: nueva.id
  });
  console.log('[NOTIFY] evento friendRequest emitido');

 
  res.redirect('/muro');
};


;

exports.rechazarSolicitud = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await SolicitudAmistad.update({ estado: 'rechazada' }, { where: { id } });

  const sol = await SolicitudAmistad.findByPk(id);
  if (sol) {
     const usuarioRechaza = await Usuario.findByPk(sol.paraId);
    const fronName = usuarioRechaza.nombre; 
    req.io.to(`user-${sol.deId}`).emit('friendRequestResponse', {
      requestId: id,
      accepted: false,
      fronName
    });
  }
  res.redirect('/muro');
};


// controllers/solicitudAmistad.js
exports.mostrarFormulario = async (req, res) => {
  const usuarioId = req.session.usuarioId;
 console.log('SESSION usuarioId =', usuarioId);
  const usuarios = await Usuario.findAll({
    where: { id: { [Op.ne]: usuarioId } },
    attributes: ['id','nombre','apellido']
  });
  console.log('Usuarios encontrados:', usuarios.length, usuarios);
  res.render('friend-new', {
    title: 'Enviar solicitud de amistad',
    usuarios     
  });
};

