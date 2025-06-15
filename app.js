require('dotenv').config();
const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const { Sequelize } = require('sequelize');
const path    = require('path');

const sequelize = new Sequelize(
  process.env.DB_NAME,   // nombre de la BD
  process.env.DB_USER,   // usuario de MySQL
  process.env.DB_PASS,   // contraseña
  {
    host:     process.env.DB_HOST,        
    port:     parseInt(process.env.DB_PORT, 10),
    dialect:  'mysql',
    dialectOptions: { /* … */ },
    logging: false
  }
);



const SequelizeStore = require('connect-session-sequelize')(session.Store);
const store = new SequelizeStore({ db: sequelize });


const app    = express();
const server = http.createServer(app);

const io = new Server(server, { transports: ['websocket'] });

app.use(session({
  secret:  process.env.SESSION_SECRET || 'un-secreto',
  store,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }             
}));

store.sync();
sequelize.sync();

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

// Sirve estáticos 
app.use(express.static(path.join(__dirname, 'public')));


// Inyecta req.io y variables de sesión en res.locals
app.use((req, res, next) => {
  req.io = io;                                     
  res.locals.usuarioId     = req.session.usuarioId     || null;
  res.locals.usuarioNombre = req.session.usuarioNombre || null;
  res.locals.usuarioFoto   = req.session.usuarioFoto   || null;
  next();
});

// Conexiones de Socket.IO y rooms
io.on('connection', socket => {
  console.log('[SOCKET] cliente conectado', socket.id);

  socket.on('register', userId => {
    if (!userId) {
      console.warn('[SOCKET] registro null, ignorado');
      return;
    }
    socket.join(`user-${userId}`);
    console.log('[SOCKET] usuario', userId, 'en room user-' + userId);
  });
  
});




// Monta  routers
app.use('/',       require('./routes/index'));
app.use('/friend', require('./routes/friend'));

// Arranca el servidor HTTP+Socket.IO
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server en puerto ${PORT}`));


