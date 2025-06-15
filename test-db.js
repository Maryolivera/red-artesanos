require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: console.log,   // para ver el detalle de la conexión
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL OK');
  } catch (err) {
    console.error('❌ Error conectando a MySQL:', err);
  } finally {
    await sequelize.close();
  }
})();
