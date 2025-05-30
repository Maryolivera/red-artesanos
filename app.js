const express = require('express');
const path    = require('path');
const { sequelize } = require('./models');
const rutas   = require('./routes/index');
const app = express();

app.set('view engine', 'pug');


//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//  Prueba de conexión a la BD 
sequelize.authenticate()
  .then(() => console.log('✔️  BD conectada'))
  .catch(e => console.error('❌ Error BD:', e));


app.use('/', rutas);

// Arranca el servidor 
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Servidor en http://localhost:${PORT}`)
);


