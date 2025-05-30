// routes/index.js
const express = require('express');
const router  = express.Router();
const usuario = require('../controllers/usuario');
const album= require('../controllers/album'); 

//rutas de usuario
router.get('/registro',  usuario.mostrarRegistro);
router.post('/registro', usuario.procesarRegistro);

router.get('/login',     usuario.mostrarLogin);
router.post('/login',    usuario.procesarLogin);

router.get('/muro',      usuario.mostrarMuro);

//rutas de albunes
router.get('/albums',      album.listarAlbums);
router.get('/albums/new',  album.mostrarFormulario);
router.post('/albums',     album.crearAlbum);


module.exports = router;

