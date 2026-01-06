const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/login', login);
// Logout (requiere estar autenticado)
router.post('/auth/logout', authMiddleware, logout);

module.exports = router;
