//auth.controller.js
// comparar password con hash almacenado en la base de datos
const bcrypt = require('bcrypt');
// generar token JWT
const jwt = require('jsonwebtoken');
const { sql } = require('../database/connection');

const login = async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Buscar usuario
  const result = await sql.query`
    SELECT id, nombre, email, password_hash, activo
    FROM Usuarios
    WHERE email = ${email}
  `;

  if (result.recordset.length === 0) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const user = result.recordset[0];

  if (!user.activo) {
    return res.status(403).json({ message: 'Usuario inactivo' });
  }

  // 2️⃣ Comparar password
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // 3️⃣ Traer roles del usuario
  const rolesResult = await sql.query`
    SELECT r.nombre
    FROM Usuario_Roles ur
    JOIN Roles r ON ur.rol_id = r.id
    WHERE ur.usuario_id = ${user.id}
  `;

  const roles = rolesResult.recordset.map(r => r.nombre); // ["ADMIN"]

  // 4️⃣ Generar JWT con roles
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      roles
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // 5️⃣ Enviar cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,       // true en producción (HTTPS)
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000
  });

  // 6️⃣ Respuesta
  res.json({
    message: 'Login correcto',
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      roles
    }
  });
};

module.exports = { login };