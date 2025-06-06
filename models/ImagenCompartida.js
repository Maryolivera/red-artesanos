
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ImagenCompartida', {
    imagenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'imagenId'
    },
    usuarioOrigenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuarioOrigenId'
    },
    usuarioDestinoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuarioDestinoId'
    },
    fecha_comparticion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_comparticion'
    }
  }, {
    tableName: 'imagenCompartida',
    timestamps: false
  });
};
