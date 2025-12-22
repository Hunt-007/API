require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./database/connection');

const PORT = process.env.APP_PORT || 3000;

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 API escuchando en http://localhost:${PORT}`);
  });
})();
