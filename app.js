const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path    = require('path');
const { sequelize } = require('./models');

const app    = express();
const server = http.createServer(app);

const io = new Server(server, { transports: ['websocket'] });

app.use(session({
  secret: 'un-secreto',       
  store: new SequelizeStore({ db: sequelize }),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }             
}));

new SequelizeStore({ db: sequelize }).sync();

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

// Sincroniza la BD (y sesiones)
sequelize.sync();

// Monta  routers
app.use('/',       require('./routes/index'));
app.use('/friend', require('./routes/friend'));

// Arranca el servidor HTTP+Socket.IO
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server en puerto ${PORT}`));


