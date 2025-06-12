// controllers/compartir.js
const { Imagen, Usuario, ImagenCompartida } = require('../models');
const { Op } = require('sequelize');

exports.mostrarFormulario = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      where: { id: { [Op.ne]: req.session.usuarioId } },
      attributes: ['id','nombre']
    });
    const imagen = await Imagen.findByPk(req.params.id);
    if (!imagen) {
      return res.status(404).send('❌ Imagen no encontrada');
    }
    res.render('compartir-form', {
      title: 'Compartir Imagen',
      usuarios,
      imagen
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('❌ Error al cargar el formulario de compartir');
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

    // opcional: validar que la imagen exista y te pertenezca
    const imagen = await Imagen.findByPk(imagenId);
    if (!imagen /* || imagen.album.usuarioId !== usuarioOrigenId */) {
      return res.status(404).send('❌ Imagen inválida o no tienes permisos');
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
