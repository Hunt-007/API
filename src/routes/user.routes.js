const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/user.controller'); // controlador que crearás
const authMiddleware = require('../middleware/auth.middleware'); // ya existente
const authorize = require('../middleware/authorize.middleware'); // middleware nuevo

// Ruta protegida solo para ADMIN

router.post(
  '/usuarios',
  authMiddleware,
  authorize('USUARIO_CREAR'),
  createUser
);

router.put(
  '/usuarios/:id',
  authMiddleware,
  authorize('USUARIO_EDITAR'),
  updateUser
);

router.delete(
  '/usuarios/:id',
  authMiddleware,
  authorize('USUARIO_ELIMINAR'),
  deleteUser
);

module.exports = router;
