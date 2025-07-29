const { Message } = require('#models');
const { Op } = require('sequelize');

module.exports = {
  send,
  getDialog,
};

async function send({ fromUserId, toUserId, text }) {
  const message = await Message.create({
    fromUserId,
    toUserId,
    text,
  });

  return message;
}

async function getDialog({ userId, otherUserId }) {
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { fromUserId: userId, toUserId: otherUserId },
        { fromUserId: otherUserId, toUserId: userId },
      ],
    },
    order: [['createdAt', 'ASC']],
  });

  return messages;
}
