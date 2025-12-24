// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

/**
 * Verifica el JWT (cookie o header Authorization) y adjunta el usuario a la request.
 */
const authMiddleware = (req, res, next) => {
  const bearer = req.headers.authorization;
  const headerToken = bearer?.startsWith('Bearer ') ? bearer.slice(7) : null;
  const cookieToken = req.cookies?.token;
  const token = headerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error verificando JWT:', err.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
