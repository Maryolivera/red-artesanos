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

  if (!titulo || !usuarioId) {
      return res.render('album-create', {
        title: 'Crear Nuevo Álbum',
        error: 'Debe completar todos los campos'
      });
    }

  
  await Album.create({
     titulo,
     usuarioId: parseInt(usuarioId, 10)
     });  
  res.redirect('/albums');
}
