const express = require('express');
const router = express.Router();

const {
  createUser,
  updateUser,
  deleteUser,
  listUsers,
  getUserById,
  getMe
} = require('../controllers/user.controller');

const authMiddleware = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const ownership = require('../middleware/ownership.middleware');//permiso de usuario admin total
const validateId = require('../middleware/validateId.middleware');//se ultliza para validar que el id sea un entero positivo

// ==============================
// CREAR usuario
// ==============================
router.post(
  '/usuarios',
  authMiddleware,
  authorize('USUARIO_CREAR'),
  createUser
);

// ==============================
// VER MI PERFIL (SIEMPRE ARRIBA)
// ==============================
router.get(
  '/usuarios/me',
  authMiddleware,
  getMe
);

// ==============================
// LISTAR usuarios
// ==============================
router.get(
  '/usuarios',
  authMiddleware,
  authorize('USUARIO_LISTAR'),
  listUsers
);

// ==============================
// OBTENER usuario por ID
// ==============================
router.get(
  '/usuarios/:id',
  authMiddleware,
  validateId,
  authorize('USUARIO_VER'),
  ownership,
  getUserById
);

// ==============================
// EDITAR usuario
// ==============================
router.put(
  '/usuarios/:id',
  authMiddleware,
  validateId,
  authorize('USUARIO_EDITAR'),
  ownership,
  updateUser
);

// ==============================
// ELIMINAR usuario
// ==============================
router.delete(
  '/usuarios/:id',
  authMiddleware,
  validateId,
  authorize('USUARIO_ELIMINAR'),
  ownership,
  deleteUser
);

module.exports = router;
