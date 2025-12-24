/**
 * Permite acceso si:
 * - el recurso pertenece al usuario
 * - o tiene permiso USUARIO_ADMIN_TOTAL
 */
const ownership = (req, res, next) => {
  const userIdToken = Number(req.user.id);
  const userIdParam = Number(req.params.id);

  // Es su propio recurso
  if (userIdToken === userIdParam) {
    return next();
  }

  // Permiso global
  if (req.user.permisos?.includes('USUARIO_ADMIN_TOTAL')) {
    return next();
  }

  return res.status(403).json({
    message: 'No tienes permisos para acceder a este recurso'
  });
};

module.exports = ownership;
