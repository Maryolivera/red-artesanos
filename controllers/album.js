
const { Album,Imagen } = require('../models');

// Lista todos los álbumes
exports.listarAlbums = async (req, res) => {
  const albums = await Album.findAll({
  include: [{ model: Imagen, as: 'imagenes' }] 
});
  res.render('album-list', { title: 'Tus Álbumes', albums });
};

//  formulario de creación
exports.mostrarFormulario = (req, res) => {
  res.render('album-create', { title: 'Crear Álbum' });
};

// Procesa creación de un nuevo álbum
exports.crearAlbum = async (req, res) => {
  const { titulo } = req.body;

  const usuarioId = 1;

  if (!titulo ) {
      return res.render('album-create', {
        title: 'Crear Álbum',
        error: 'El titulo es obligatorio'
      });
    }

  
  await Album.create({
     titulo,
     usuarioId
     });  
  res.redirect('/albums');
}

//  mostrar galería por álbum 
exports.mostrarGaleria = async (req, res) => {
  const id = Number(req.params.id);

  // Traemos el álbum junto con sus imágenes
  const album = await Album.findByPk(id, {
    include: [{ model: Imagen, as: 'imagenes', order: [['fecha_subida', 'DESC']] }]
  });

  if (!album) return res.status(404).send('Álbum no encontrado');

  res.render('galeria', {
    title: `Galería: ${album.titulo}`,
    album,                     
    imagenes: album.imagenes   
  });
};
