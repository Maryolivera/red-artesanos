
const { Album,Imagen } = require('../models');

//los álbumes
exports.listarAlbums = async (req, res) => {
  const usuarioId = req.session.usuarioId;
  const albums = await Album.findAll({
    where: { usuarioId }, // <--- SOLO los del usuario
    include: [{ model: Imagen, as: 'imagenes' }]
  });
  res.render('album-list', { title: 'Tus Álbumes', albums });
};


//  formulario de creación
exports.mostrarFormulario = (req, res) => {
  res.render('album-create', { title: 'Crear Álbum' });
};


exports.crearAlbum = async (req, res) => {
  try {
    const { titulo } = req.body;
    const usuarioId = req.session.usuarioId;

    // Agregá este log:
    console.log('Intentando crear álbum con usuarioId:', usuarioId, 'y título:', titulo);

    if (!titulo) {
      return res.render('album-create', {
        title: 'Crear Álbum',
        error: 'El título es obligatorio'
      });
    }

    await Album.create({
      titulo,
      usuarioId
    });

    res.redirect('/albums');
  } catch (err) {
    // MOSTRÁ EL ERROR REAL EN CONSOLA Y EN LA VISTA:
    console.error('Error al crear álbum:', err);
    res.render('album-create', {
      title: 'Crear Álbum',
      error: err.message  
    });
  }
};


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
