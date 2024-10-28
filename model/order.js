const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    id_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Utilisateur',
        key: 'id_user',
      },
      onDelete: 'CASCADE',
    },
  }, {
    timestamps: true,
  });

  return Order;
};
