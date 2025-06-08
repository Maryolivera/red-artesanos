const express = require('express');
const router  = express.Router();

const usuario = require('../controllers/usuario');

const { isLoggedIn } = require('../middlewares/auth');



const album= require('../controllers/album'); 
const imagen     = require('../controllers/imagen');
const upload = require('../middlewares/upload');
const compartir = require('../controllers/compartir');
router.get('/albums/:id/galeria', album.mostrarGaleria);


router.post('/images', upload.single('foto'), imagen.procesarUpload);
router.get('/images/:id/detalle',   imagen.mostrarDetalle);
//pagina de inicio 
router.get('/', (req, res) => {
  res.render('inicio', { title: 'Artesanos.com',
  usuario: req.session.usuarioId ? req.session.usuarioNombre : null
   });
})

//rutas de usuario
router.get('/registro',  usuario.mostrarRegistro);
router.post('/registro', usuario.procesarRegistro);

router.get('/login',     usuario.mostrarLogin);
router.post('/login',    usuario.procesarLogin);

router.get('/logout', usuario.procesarLogout);


router.get('/muro', isLoggedIn, usuario.mostrarMuro);

router.get('/usuarios', usuario.listarUsuarios);

//rutas de solicitudAmistad
// Aceptar solicitud
router.post('/friends/:id/aceptar', isLoggedIn, async (req, res) => {
  const { SolicitudAmistad } = require('../models');
  await SolicitudAmistad.update(
    { estado: 'aceptada' },
    { where: { id: req.params.id } }
  );
  res.redirect('/friends');
});

// Rechazar solicitud
router.post('/friends/:id/rechazar', isLoggedIn, async (req, res) => {
  const { SolicitudAmistad } = require('../models');
  await SolicitudAmistad.update(
    { estado: 'rechazada' },
    { where: { id: req.params.id } }
  );
  res.redirect('/friends');
});

router.get('/friends/enviadas', isLoggedIn, async (req, res) => {
  const { SolicitudAmistad, Usuario } = require('../models');
  const usuarioId = req.session.usuarioId;

  const solicitudes = await SolicitudAmistad.findAll({
    where: { deId: usuarioId, estado: 'pendiente' },
    include: [{
      model: Usuario,
      as: 'destino',      
      attributes: ['nombre']
    }]
  });

  res.render('friends-sent', {
    title: 'Solicitudes enviadas',
    solicitudes
  });
});



router.get('/friends/new', isLoggedIn, async (req, res) => {
  const { Usuario } = require('../models');
  const usuarioId = req.session.usuarioId;

  const usuarios = await Usuario.findAll({
    where: { id: { [require('sequelize').Op.ne]: usuarioId } }
  });

  res.render('friend-new', {
    title: 'Enviar solicitud de amistad',
    usuarios
  });
});

// Procesar envío de solicitud
router.post('/friends', isLoggedIn, async (req, res) => {
  const { SolicitudAmistad } = require('../models');
  const deId = req.session.usuarioId;
  const { paraId } = req.body;

  // No enviar a uno mismo
  if (parseInt(deId) === parseInt(paraId)) {
    return res.redirect('/friends/new');
  }

  // Evitar duplicados
  const yaExiste = await SolicitudAmistad.findOne({
    where: { deId, paraId, estado: 'pendiente' }
  });
  if (yaExiste) return res.redirect('/friends');

  await SolicitudAmistad.create({ deId, paraId, estado: 'pendiente' });
  res.redirect('/friends');
});

// Mostrar solicitudes recibidas
router.get('/friends', isLoggedIn, async (req, res) => {
  const { SolicitudAmistad, Usuario } = require('../models');
  const usuarioId = req.session.usuarioId;

  const solicitudes = await SolicitudAmistad.findAll({
    where: { paraId: usuarioId, estado: 'pendiente' },
    include: [{
      model: Usuario,
      as: 'origen',      
      attributes: ['nombre']
    }]
  });

  res.render('friends-list', {
    title: 'Solicitudes de amistad',
    solicitudes
  });
});
//rutas lista amigos
router.get('/friends/list', isLoggedIn, async (req, res) => {
  const { SolicitudAmistad, Usuario } = require('../models');
  const usuarioId = req.session.usuarioId;

  // Buscar todas las solicitudes aceptadas donde este usuario sea origen o destino
  const solicitudes = await SolicitudAmistad.findAll({
    where: {
      estado: 'aceptada',
      [require('sequelize').Op.or]: [
        { deId: usuarioId },
        { paraId: usuarioId }
      ]
    }
  });

  // Conseguir los IDs de los amigos (el otro usuario en cada solicitud)
  const amigoIds = solicitudes.map(sol =>
    sol.deId === usuarioId ? sol.paraId : sol.deId
  );

  // Buscar datos de los amigos
  const amigos = await Usuario.findAll({
    where: { id: amigoIds }
  });

  res.render('friends-list-all', {
    title: 'Mis amigos',
    amigos
  });
});


//rutas de albunes
router.get('/albums',      album.listarAlbums);
router.get('/albums/new',  album.mostrarFormulario);
router.post('/albums',     album.crearAlbum);
router.get('/albums/:id/galeria', album.mostrarGaleria); 



//rutas de imagenes

router.get('/images/new', imagen.mostrarFormulario); 
router.post('/images',    imagen.procesarUpload);
router.get('/images',     imagen.listarImagenes);

// rutas de compartir imagen
router.get('/images/:id/compartir',isLoggedIn,  compartir.mostrarFormulario);

router.post('/images/:id/compartir',isLoggedIn,  compartir.procesarCompartir);



module.exports = router;

