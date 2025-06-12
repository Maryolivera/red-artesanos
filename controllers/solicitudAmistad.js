// controllers/solicitudAmistad.js
const { SolicitudAmistad, Usuario } = require('../models');
const { Op } = require('sequelize');

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


exports.aceptarSolicitud = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await SolicitudAmistad.update({ estado: 'aceptada' }, { where: { id } });

  const sol = await SolicitudAmistad.findByPk(id);
  if (sol) {
    req.io.to(`user-${sol.deId}`).emit('friendRequestResponse', {
      requestId: id,
      accepted: true
    });
  }
  res.redirect('/muro');
};

exports.rechazarSolicitud = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await SolicitudAmistad.update({ estado: 'rechazada' }, { where: { id } });

  const sol = await SolicitudAmistad.findByPk(id);
  if (sol) {
    req.io.to(`user-${sol.deId}`).emit('friendRequestResponse', {
      requestId: id,
      accepted: false
    });
  }
  res.redirect('/muro');
};



