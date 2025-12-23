//auth.middleware.js
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permisos;

    if (!userPermissions) {
      return res.status(403).json({ message: 'Permisos no encontrados' });
    }

    const hasPermission = requiredPermissions.some(p =>
      userPermissions.includes(p)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  };
};

module.exports = authorize;
