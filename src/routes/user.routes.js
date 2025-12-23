const express = require('express');
const router = express.Router();

const {
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');

const authMiddleware = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');

// CREAR usuario
router.post(
  '/usuarios',
  authMiddleware,
  authorize('USUARIO_CREAR'),
  createUser
);

// EDITAR usuario
router.put(
  '/usuarios/:id',
  authMiddleware,
  authorize('USUARIO_EDITAR'),
  updateUser
);

// ELIMINAR usuario
router.delete(
  '/usuarios/:id',
  authMiddleware,
  authorize('USUARIO_ELIMINAR'),
  deleteUser
);

module.exports = router;
