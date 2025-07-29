// Модель сообщений и пользователей( ну блиин)
const { Message, User } = require('#models');
const { Err } = require('#factories/errors');
const { Op } = require('sequelize');
const { createOKResponse, createErrorResponse } = require('#factories/responses/api');

module.exports = ChatController;

function ChatController() {
  // Отправка нового сообщения между пользователями
  const _sendMessage = async (req, res) => {
    try {
      const fromUserId = req?.token?.id;
      const { toUserId, text } = req.body;

      if (!toUserId || !text) {
        const err = new Err('Missing message fields');
        err.name = 'ValidationError';
        throw err;
      }

      const message = await Message.create({
        fromUserId,
        toUserId,
        text
      });

      return createOKResponse({
        res,
        content: { message }
      });
    } catch (error) {
      return createErrorResponse({ res, error });
    }
  };

  // Получить историю переписки между двумя пользователями(я знаю о чем вы говорите)
  const _getDialog = async (req, res) => {
    try {
      const userId = req?.token?.id;
      const otherUserId = parseInt(req.params.userId);

      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { fromUserId: userId, toUserId: otherUserId },
            { fromUserId: otherUserId, toUserId: userId }
          ]
        },
        order: [['createdAt', 'ASC']]
      });

      return createOKResponse({
        res,
        content: { messages }
      });
    } catch (error) {
      return createErrorResponse({ res, error });
    }
  };

  return {
    sendMessage: _sendMessage,
    getDialog: _getDialog
  };
}
