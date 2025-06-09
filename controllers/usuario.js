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
    res.redirect('/');
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
exports.crearAlbum = async (req, res) => {
  try {
    const { titulo } = req.body;
    const usuarioId = req.session.usuarioId; 

    if (!titulo || !usuarioId) {
      return res.render('album-create', { 
        title: 'Crear Álbum', 
        error: 'Faltan datos para crear el álbum'
      });
    }

    await Album.create({
      titulo,
      usuarioId
    });

    res.redirect('/albums');
  } catch (err) {
    console.error('Error al crear álbum:', err);
    res.render('album-create', { 
      title: 'Crear Álbum', 
      error: 'Error al crear el álbum'
    });
  }
};
// Mostrar perfil
exports.mostrarPerfil = async (req, res) => {
  const usuario = await Usuario.findByPk(req.session.usuarioId);
  res.render('perfil', { usuario });
};

// Formulario de edición
exports.formularioEditarPerfil = async (req, res) => {
  const usuario = await Usuario.findByPk(req.session.usuarioId);
  res.render('perfil-editar', { usuario });
};

// Procesar edición
exports.procesarEditarPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.session.usuarioId);
    const { nombre, email, intereses, antecedentes, portafolioPublico } = req.body;

    usuario.nombre = nombre;
    usuario.email = email;
    usuario.intereses = intereses;
    usuario.antecedentes = antecedentes;
    usuario.portafolioPublico = portafolioPublico ? 1 : 0;

    // Si subió imagen de perfil
    if (req.file) {
      usuario.foto_perfil = req.file.filename;
    }
    await usuario.save();
    res.redirect('/perfil');
  } catch (err) {
    res.render('perfil-editar', { usuario, error: 'Error al guardar los cambios.' });
  }
};

// Formulario para cambiar password
exports.formularioCambiarPassword = (req, res) => {
  res.render('perfil-password');
};

// Procesar cambio de password
exports.procesarCambiarPassword = async (req, res) => {
  const usuario = await Usuario.findByPk(req.session.usuarioId);
  const { actual, nueva } = req.body;
  if (bcrypt.compareSync(actual, usuario.password)) {
    usuario.password = bcrypt.hashSync(nueva, 10);
    await usuario.save();
    res.redirect('/perfil');
  } else {
    res.render('perfil-password', { error: 'Contraseña actual incorrecta' });
  }
};
