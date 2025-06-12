const express = require('express');
const router  = express.Router();

const usuario = require('../controllers/usuario');

const { isLoggedIn } = require('../middlewares/auth');
const ctrlCompartir  = require('../controllers/compartir');
const ctrlImagen = require('../controllers/imagen');



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


router.get('/perfil', isLoggedIn, usuario.mostrarPerfil);
router.get('/perfil/editar', isLoggedIn, usuario.formularioEditarPerfil);
router.post('/perfil/editar', isLoggedIn, upload.single('foto_perfil'), usuario.procesarEditarPerfil);
router.get('/perfil/password', isLoggedIn, usuario.formularioCambiarPassword);
router.post('/perfil/password', isLoggedIn, usuario.procesarCambiarPassword);



router.get('/muro', isLoggedIn, usuario.mostrarMuro);

router.get('/usuarios', usuario.listarUsuarios);


//rutas de albunes//

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
router.get('/images/mis',    isLoggedIn, ctrlImagen.listarMisImagenes);
router.post('/images/:id/compartir',isLoggedIn,  compartir.procesarCompartir);
//router.get('/images', isLoggedIn, ctrlImagen.listarMuro);


router.get('/logout', usuario.procesarLogout);


module.exports = router;

