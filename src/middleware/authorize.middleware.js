// src/middleware/authorize.middleware.js
const authorize = (permisoRequerido) => {
  return (req, res, next) => {

    if (!req.user || !req.user.permisos) {
      return res.status(403).json({ message: 'Permisos no encontrados' });
    }

    if (!req.user.permisos.includes(permisoRequerido)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  };
};

module.exports = authorize;
