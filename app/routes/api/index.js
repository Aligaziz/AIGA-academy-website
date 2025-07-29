const bankRoutes = require('./bankRoutes');
const chatRoutes = require('./chatRoutes');
module.exports = versionString => ({
	private: require(`./${versionString}/privateRoutes`),
	public: require(`./${versionString}/publicRoutes`)
});
router.use('/bank', bankRoutes);
router.use('/chat', chatRoutes);
