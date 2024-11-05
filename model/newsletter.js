const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Newsletter = sequelize.define('Newsletter', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,         
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    timestamps: true,          
    tableName: 'newsletters'  
  });

  return Newsletter;
};
