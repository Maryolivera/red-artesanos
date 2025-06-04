const path   = require('path');
const multer = require('multer');
const { Imagen,Album } = require('../models');

// Configuración de Multer: destino y nombre
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..' , 'public' , 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Mostrar formulario 
exports.mostrarFormulario = async (req, res) => {
  try {
    const albunes = await Album.findAll();
    return res.render('imagen-upload', {
      title: 'Subir Imagen',
      albunes
    });
  } catch (e) {
    console.error(e);
    return res.send('❌ Error al cargar formulario.');
  }
};

// Procesar subida (POST "/images")
exports.procesarUpload = [
  upload.single('imagen'),
  async (req, res) => {
    try {
      const { albumId, caption } = req.body;
      const rutaEnServidor = '/uploads/' + req.file.filename;

      await Imagen.create({
        albumId: parseInt(albumId),
        ruta: rutaEnServidor,
        caption: caption || null
      });

      return res.redirect('/images');
    } catch (err) {
      console.error(err);
      return res.send('❌ Error al guardar la imagen.');
    }
  }
];

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