const { Usuario, Album, Imagen } = require('../models');


exports.mostrarRegistro = (req, res) => {
  res.render('registro', { title: 'Registro' });
};

exports.procesarRegistro = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    await Usuario.create({ nombre, email, password });
     return res.redirect('/login');
  } catch (err) {
    
  
    return res.render('registro', {
      title: 'Registro',
      error: 'El email ya existe o faltan datos'
    });
  }
};

exports.mostrarLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.procesarLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email, password } });
    if (user) {
      // Guardamos el usuario en la sesión
      req.session.usuarioId = user.id;
      req.session.nombre = user.nombre;
      return res.redirect('/muro'); 
    }

     return res.render('login', {
      title: 'Login',
      error: 'Credenciales inválidas'
    });
  } catch (err) {
    console.error(err);
    return res.render('login', {
      title: 'Login',
      error: 'Error en el servidor'
    });
  }
};

exports.procesarLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/login');
  });
};
exports.mostrarMuro = async (req, res) => {
  try {
    const usuarioId = req.session.usuarioId;

    //  Tus álbumes
    const albums = await Album.findAll({
      where: { usuarioId }
    });

   
    const imagenes = await Imagen.findAll({
      include: [{
        association: 'album',              
        where: { usuarioId }
      }],
      order: [['fecha_subida', 'DESC']]
    });

    return res.render('muro', {
      title: 'Mi Muro',
      usuario: req.session.nombre,
      albums,
      imagenes
    });
  } catch (e) {
    console.error(e);
    return res.send('❌ Error al mostrar el muro.');
  }
};







exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.render('usuario-list', { title: 'Listado de Usuarios', usuarios });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener usuarios');
  }
};
