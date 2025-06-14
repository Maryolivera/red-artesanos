const path   = require('path');


const { Imagen,Album,Usuario,ImagenCompartida } = require('../models');
const { Op } = require('sequelize');


exports.listarCompartidas = async (req, res) => {
  const miId = req.session.usuarioId;
  // Busca todas las filas donde usuarioDestinoId = yo
  const rows = await ImagenCompartida.findAll({
    where: { usuarioDestinoId: miId },
    include: [{
      model: Imagen,
      as: 'imagen'
    },{
      model: Usuario,
      as: 'origen',
      attributes: ['id','nombre']
    }]
  });
  // Mapea al formato para la vista:
  const compartidas = rows.map(r => ({
    id:          r.imagen.id,
    ruta:        r.imagen.ruta,
    descripcion: r.imagen.descripcion,
    from:        r.origen.nombre
  }));
  res.render('imagen-compartidas', {
    title: 'Imágenes compartidas conmigo',
    compartidas
  });
};

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
    const usuarioId = req.session.usuarioId;
    const albums = await Album.findAll({
    where: { usuarioId },
    attributes: ['id', 'titulo']
  });
    
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





exports.listarMuro = async (req, res) => {
  const userId = req.session.usuarioId;

  // Busca sólo las imágenes por album 
  const imagenes = await Imagen.findAll({
    include: [{
      model: Album,
      where: { usuarioId: userId }        
    }]
  });

  res.render('imagenes-muro', {
    title: 'Mis imágenes',
    imagenes
  });
};

exports.listarMisImagenes = async (req, res) => {
  const usuarioId = req.session.usuarioId;
  try {
    const imagenes = await Imagen.findAll({
      include: [{
        model: Album,
        as: 'album',           
        where: { usuarioId },  
        attributes: []          
      }]
    });

    res.render('mis-imagenes', {
      title: 'Mis imágenes',
      imagenes
    });
  } catch (err) {
    console.error('🔴 Error al listar tus imágenes:', err);
    res.send(`❌ Error al listar tus imágenes: ${err.message}`);
  }
};

