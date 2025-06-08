const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('SolicitudAmistad', {
    deId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'deId'
    },
    paraId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'paraId'
    },
    estado: {
      type: DataTypes.ENUM('pendiente','aceptada','rechazada'),
      allowNull: false,
      defaultValue: 'pendiente',
      field: 'estado'
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_solicitud'
    }
  }, {
    tableName: 'solicitudesamistad',
    timestamps: false
  });
};
