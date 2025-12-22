const { checkDB } = require('../database/connection');

const healthCheck = async (req, res) => {
  const dbOnline = await checkDB();

  res.status(200).json({
    api: 'online',
    database: dbOnline ? 'online' : 'offline',
    timestamp: new Date()
  });
};

module.exports = {
  healthCheck
};
