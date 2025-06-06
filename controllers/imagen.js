const path   = require('path');
const { Imagen,Album } = require('../models');
exports.mostrarDetalle = async (req, res) => {
  try {
    
    
    const imagen = await Imagen.findByPk(req.params.id, {
      include: [{ model: Album, as: 'album' }]
    });

    if (!imagen) {
      return res.status(404).send('❌ Imagen no encontrada.');
    }

    return res.render('imagen-detalle', {
      title: `Detalle de Imagen #${imagen.id}`,
      imagen
    });
  } catch (err) {
    console.error(err);
    return res.send('❌ Error al mostrar el detalle de la imagen.');
  }
};


// Mostrar formulario 
exports.mostrarFormulario = async (req, res) => {
  try {
    const albums = await Album.findAll();
    res.render('imagen-upload', {
      title: 'Subir Imagen', albums
    });
  } catch (e) {
    console.error(e);
    return res.send('❌ Error al cargar formulario.');
  }
};

exports.procesarUpload = async (req, res) => {
  if (!req.file) {
    return res.send('⚠️ No se recibió ningún archivo');
  }

  const { albumId, descripcion } = req.body;

  await Imagen.create({
    albumId: parseInt(albumId, 10),
    ruta: `uploads/${req.file.filename}`,
    caption: descripcion || null
  });

  res.redirect('/images');
};

// Listar todas las imágenes
exports.listarImagenes = async (req, res) => {
  try {
    const imagenes = await Imagen.findAll({
      order: [['fecha_subida', 'DESC']]
    });

    return res.render('imagen-list', {
      title: 'Listado de Imágenes',
      imagenes
    });
  } catch (e) {
    console.error(e);
    return res.send('❌ Error al listar imágenes.');
  }
};