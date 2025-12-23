// src/middleware/authorize.middleware.js
/* const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || []; // roles vienen del JWT

    const hasRole = userRoles.some(role => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  };
};

module.exports = authorize;
 */
const authorize = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.roles) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    if (!user.roles.includes(requiredRole)) {
      return res.status(403).json({ message: 'Permisos insuficientes' });
    }

    next();
  };
};

module.exports = authorize;
