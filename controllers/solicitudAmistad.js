const { SolicitudAmistad, Usuario } = require('../models');
const { Op } = require('sequelize');

exports.enviarSolicitud = async (req, res) => {
  const usuarioOrigenId = req.session.usuarioId;
  const usuarioDestinoId = parseInt(req.params.id,10);
  if (usuarioOrigenId === usuarioDestinoId) {
    return res.send('No puedes enviarte solicitud a ti mismo.');
  }
  await SolicitudAmistad.create({ deId: usuarioOrigenId, paraId: usuarioDestinoId });
  res.redirect('/friends');
};

exports.listarSolicitudesRecibidas = async (req, res) => {
  const usuarioId = req.session.usuarioId;
  const solicitudes = await SolicitudAmistad.findAll({
    where: { paraId: usuarioId, estado: 'pendiente' },
    include: [{ model: Usuario, as: 'origen', attributes: ['id','nombre'] }]
  });
  res.render('friends-list', { title: 'Solicitudes de Amistad', solicitudes });
};

exports.aceptarSolicitud = async (req, res) => {
  await SolicitudAmistad.update(
    { estado: 'aceptada' },
    { where: { id: parseInt(req.params.id,10) } }
  );
  res.redirect('/friends');
};

exports.rechazarSolicitud = async (req, res) => {
  await SolicitudAmistad.update(
    { estado: 'rechazada' },
    { where: { id: parseInt(req.params.id,10) } }
  );
  res.redirect('/friends');
};
