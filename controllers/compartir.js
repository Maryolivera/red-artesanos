const { Op } = require('sequelize');  
const { ImagenCompartida, Usuario, Imagen } = require('../models');

exports.mostrarFormulario = async (req, res) => {
  try {
    // 1 Obtiene lista de usuarios para “compartir con…”
    const usuarios = await Usuario.findAll({
      where: { id: { [Op.ne]: req.session.usuarioId } }, 
      attributes: ['id','nombre']
    });
    // se obtienen datos de la imagen a compartir
    const imagen = await Imagen.findByPk(req.params.id);
    return res.render('compartir-form', {
      title: 'Compartir Imagen',
      usuarios,
      imagen
    });
  } catch (e) {
    console.error(e);
    return res.send('❌ Error al cargar formulario de compartir.');
  }
};

exports.procesarCompartir = async (req, res) => {
  try {
    const usuarioOrigenId  = req.session.usuarioId;    
    const { usuarioDestinoId } = req.body;
    const imagenId = parseInt(req.params.id, 10);

    
    const yaExiste = await ImagenCompartida.findOne({
      where: { imagenId, usuarioOrigenId, usuarioDestinoId }
    });
    if (!yaExiste) {
      await ImagenCompartida.create({ imagenId, usuarioOrigenId, usuarioDestinoId });
    }
    return res.redirect(`/images/${imagenId}/detalle`);
  } catch (err) {
    console.error(err);
    return res.send('❌ Error al compartir la imagen.');
  }
};
