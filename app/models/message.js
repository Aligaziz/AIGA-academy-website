const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'messages',
    timestamps: true, // добавляет createdAt, updatedAt
  });

  return Message;
};
room: {
  type: DataTypes.STRING,
  allowNull: true, // null → 1-на-1 чат, строка → групповой чат
}
