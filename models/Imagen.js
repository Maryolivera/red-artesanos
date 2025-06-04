const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Imagen', {
    albumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field:'albumId'
      },

    ruta: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha_subida: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
      tableName: 'imagenes',  
      timestamps: false      
    }
);
};
