const { User, Transaction } = require('#models/Transactions');
const { Err } = require('#factories/errors');

module.exports = {
  deposit,
  withdraw,
  transfer,
  getHistory
};

async function deposit({ userId, amount }) {
  if (amount <= 0) throw new Err('Amount must be positive');

  const user = await User.findByPk(userId);
  user.balance += amount;
  await user.save();

  await Transaction.create({ type: 'deposit', toUserId: userId, amount });

  return user.balance;
}

async function withdraw({ userId, amount }) {
  const user = await User.findByPk(userId);
  if (user.balance < amount) throw new Err('Insufficient funds');

  user.balance -= amount;
  await user.save();

  await Transaction.create({ type: 'withdraw', fromUserId: userId, amount });

  return user.balance;
}

async function transfer({ fromUserId, toUserId, amount }) {
  const fromUser = await User.findByPk(fromUserId);
  const toUser = await User.findByPk(toUserId);

  if (fromUser.balance < amount) throw new Err('Insufficient funds');

  fromUser.balance -= amount;
  toUser.balance += amount;

  await fromUser.save();
  await toUser.save();

  await Transaction.create({ type: 'transfer', fromUserId, toUserId, amount });

  return true;
}

async function getHistory({ userId }) {
  return await Transaction.findAll({
    where: {
      [sequelize.Op.or]: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    },
    order: [['createdAt', 'DESC']]
  });
}
