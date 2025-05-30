// controllers/album.js
const { Album } = require('../models');

// Lista todos los álbumes
exports.listarAlbums = async (req, res) => {
  const albums = await Album.findAll();
  res.render('album-list', { title: 'Tus Álbumes', albums });
};

//  formulario de creación
exports.mostrarFormulario = (req, res) => {
  res.render('album-create', { title: 'Crear Álbum' });
};

// Procesa creación de un nuevo álbum
exports.crearAlbum = async (req, res) => {
  const { titulo } = req.body;

  //await Album.create({ titulo, usuarioId: 1 });
  await Album.create({ titulo });   // creamos sólo con el título
  res.redirect('/albums');
};
