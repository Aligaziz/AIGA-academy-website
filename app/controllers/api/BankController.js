const { createOKResponse, createErrorResponse } = require('#factories/responses/api');
const bankFacade = require('#facades/bank');

module.exports = BankController;

function BankController() {
  const _deposit = async (req, res) => {
    try {
      const userId = req.token.id;
      const { amount } = req.body;
      const balance = await bankFacade.deposit({ userId, amount });

      return createOKResponse({ res, content: { balance } });
    } catch (error) {
      return createErrorResponse({ res, error });
    }
  };

  const _withdraw = async (req, res) => {
    try {
      const userId = req.token.id;
      const { amount } = req.body;
      const balance = await bankFacade.withdraw({ userId, amount });

      return createOKResponse({ res, content: { balance } });
    } catch (error) {
      return createErrorResponse({ res, error });
    }
  };

  const _transfer = async (req, res) => {
    try {
      const fromUserId = req.token.id;
      const { toUserId, amount } = req.body;
      await bankFacade.transfer({ fromUserId, toUserId, amount });

      return createOKResponse({ res, content: { success: true } });
    } catch (error) {
      return createErrorResponse({ res, error });
    }
  };

  const _getHistory = async (req, res) => {
    try {
      const userId = req.token.id;
      const history = await bankFacade.getHistory({ userId });

      return createOKResponse({ res, content: { history } });
    } catch (error) {
      return createErrorResponse({ res, error });
    }
  };

  return {
    deposit: _deposit,
    withdraw: _withdraw,
    transfer: _transfer,
    getHistory: _getHistory
  };
}
