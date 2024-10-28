const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ArticleOrder = sequelize.define('ArticleOrder', {
    articleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Articles',
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'Article_order'
  });

  return ArticleOrder;
};
