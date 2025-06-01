// controllers/usuario.js
const { Usuario } = require('../models');

exports.mostrarRegistro = (req, res) => {
  res.render('registro', { title: 'Registro' });
};

exports.procesarRegistro = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    await Usuario.create({ nombre, email, password });
    // confirmamos
    return res.send('✅ Usuario registrado con éxito');
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
  const user = await Usuario.findOne({ where: { email, password } });
  if (user) {
    // respuesta
    return res.send(`✅ Bienvenido, ${user.nombre}`);
  }
  return res.render('login', {
    title: 'Login',
    error: 'Credenciales inválidas'
  });
};

exports.mostrarMuro = (req, res) => {
  res.send('Este será tu muro más adelante.');
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
