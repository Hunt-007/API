const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Acceso autorizado',
    user: req.user
  });
});

module.exports = router;
