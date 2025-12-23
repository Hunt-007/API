//auth.middleware.js
const authorize = (requiredPermission) => {
  return (req, res, next) => {
    const permisos = req.user?.permisos;

    if (!permisos || !permisos.includes(requiredPermission)) {
      return res.status(403).json({ message: 'Permiso denegado' });
    }

    next();
  };
};

module.exports = authorize;