// Importa sólo DataTypes de Sequelize
const { DataTypes } = require('sequelize');



module.exports = (sequelize) => {
  //  define  el modelo y lo devuelve
  return sequelize.define('Usuario', {
    nombre:           { type: DataTypes.STRING,  allowNull: false },
    email:            { type: DataTypes.STRING,  allowNull: false, unique: true },
    password:         { type: DataTypes.STRING,  allowNull: false },
    foto_perfil:      { type: DataTypes.STRING,  allowNull: true },
    portafolioPublico:{ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    fecha_registro:   { type: DataTypes.DATE,    allowNull: false, defaultValue: DataTypes.NOW }
  },
{
      
      tableName: 'usuarios',  
      timestamps: false      }  

)
};



