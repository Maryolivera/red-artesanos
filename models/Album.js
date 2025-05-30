// models/Album.js

// models/Album.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Album', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });
};
