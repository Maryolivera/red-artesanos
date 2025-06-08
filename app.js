const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path    = require('path');
const { sequelize } = require('./models');
const rutas   = require('./routes/index');
const app = express();

app.set('view engine', 'pug');


//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



// Configuración de express-session con SequelizeStore
app.use(
  session({
    secret: 'un-secreto-muy-seguro',     
    store: new SequelizeStore({ db: sequelize }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false                     
    }
  })
);

// Sincronizar la tabla de sesiones en la base de datos
sequelize.sync(); 

// Tus rutas:
const routes = require('./routes/index');
app.use('/',routes);







app.use('/', rutas);
module.exports = app;
// Arranca el servidor 
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Servidor en http://localhost:${PORT}`)
);


