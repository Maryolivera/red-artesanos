// routes/index.js
const express = require('express');
const router  = express.Router();
const usuario = require('../controllers/usuario');
const album= require('../controllers/album'); 
const imagen     = require('../controllers/imagen');

//pagina de inicio 
router.get('/', (req, res) => {
  res.render('inicio', { title: 'Artesanos.com' });
})

//rutas de usuario
router.get('/registro',  usuario.mostrarRegistro);
router.post('/registro', usuario.procesarRegistro);

router.get('/login',     usuario.mostrarLogin);
router.post('/login',    usuario.procesarLogin);

router.get('/muro',      usuario.mostrarMuro);
router.get('/usuarios', usuario.listarUsuarios);


//rutas de albunes
router.get('/albums',      album.listarAlbums);
router.get('/albums/new',  album.mostrarFormulario);
router.post('/albums',     album.crearAlbum);




//rutas de imagenes

router.get('/images/new', imagen.mostrarFormulario); 
router.post('/images',    imagen.procesarUpload);
router.get('/images',     imagen.listarImagenes);





module.exports = router;

