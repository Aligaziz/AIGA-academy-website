module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    text: DataTypes.TEXT
  });

  return Message;
};
