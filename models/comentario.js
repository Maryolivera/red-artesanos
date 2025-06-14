const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Comentario', {
    imagenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
     
    },
    autorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
     
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: true,
     
    }
   
  }, {
    tableName: 'comentarios',
    timestamps: false
  });
};
