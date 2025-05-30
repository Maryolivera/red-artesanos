// routes/index.js
const express = require('express');
const router  = express.Router();
const usuario = require('../controllers/usuario');

router.get('/registro',  usuario.mostrarRegistro);
router.post('/registro', usuario.procesarRegistro);

router.get('/login',     usuario.mostrarLogin);
router.post('/login',    usuario.procesarLogin);

router.get('/muro',      usuario.mostrarMuro);

module.exports = router;

