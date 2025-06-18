module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'albums',
    timestamps: false
  });

  return Album;
};


