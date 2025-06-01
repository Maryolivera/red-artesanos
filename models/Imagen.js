const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Imagen', {
    ruta: {
      type: DataTypes.STRING,
      allowNull: false
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha_subida: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });
};
