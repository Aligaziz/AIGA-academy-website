const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('deposit', 'withdraw', 'transfer'),
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    tableName: 'transactions',
    timestamps: true,
  });

  return Transaction;
};
