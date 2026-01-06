/* const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization requerido' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded debe traer id, email y permisos
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;

 */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1️⃣ Leer token desde cookie
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Authorization requerido' });
  }

  try {
    // 2️⃣ Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded: { id, email, permisos }
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
