// Importa sólo DataTypes de Sequelize
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
   
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },


    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido:{
       type: DataTypes.STRING,
       allowNull: false,
       },

  
    

    foto_perfil: {
      type: DataTypes.STRING,
      allowNull: true
    },
    intereses: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    antecedentes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    portafolioPublico: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'usuarios',
    timestamps: false   
  });

  return Usuario;
};





