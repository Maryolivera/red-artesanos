const express = require('express');
const router  = express.Router();
const { isLoggedIn } = require('../middlewares/auth');
const ctrl    = require('../controllers/solicitudAmistad');


// Listar recibidas
router.get('/',            isLoggedIn, ctrl.listarSolicitudesRecibidas);

// Formulario nueva
router.get('/new',         isLoggedIn, ctrl.mostrarFormulario);

// Procesar envío
router.post('/',           isLoggedIn, ctrl.enviarSolicitud);

// Listar enviadas
router.get('/enviadas',    isLoggedIn, ctrl.listarSolicitudesEnviadas);

// Listar amigos
router.get('/list',        isLoggedIn, ctrl.listarAmigos);

// Aceptar
router.post('/:id/aceptar', isLoggedIn, ctrl.aceptarSolicitud);

// Rechazar
router.post('/:id/rechazar', isLoggedIn, ctrl.rechazarSolicitud);



module.exports = router;
