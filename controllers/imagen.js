const path   = require('path');
const multer = require('multer');
const { Imagen } = require('../models');

// Configuración de Multer: destino y nombre
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/imagenes'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});
const subirImagen = multer({ storage });

// Mostrar formulario 
exports.mostrarFormulario = (req, res) => {
  res.render('subir-imagen', { title: 'Añadir Imagen' });
};

// Procesa subida y guarda  en BD
exports.procesarUpload = [
  subirImagen.single('imagen'),
  async (req, res) => {
    if (!req.file) return res.send('❌ No seleccionaste un archivo');

    // Guarda en BD
    await Imagen.create({
      ruta: req.file.filename,
      caption: req.body.caption || null,
      albumId: 1     
    });

    res.redirect('/images');
  }
];

// Lista todas las imágenes
exports.listarImagenes = async (req, res) => {
  const imagenes = await Imagen.findAll();
  res.render('imagen-list', { title: 'Galería', imagenes });
};
