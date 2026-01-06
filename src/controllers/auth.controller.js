//auth.controller.js
// comparar password con hash almacenado en la base de datos
const bcrypt = require('bcrypt');
// generar token JWT
const jwt = require('jsonwebtoken');
const { sql } = require('../database/connection');

const login = async (req, res) => {
  try {
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

    // 3️⃣ Traer permisos
    const permisosResult = await sql.query`
      SELECT DISTINCT p.codigo
      FROM Permisos p
      INNER JOIN Rol_Permisos rp ON rp.permiso_id = p.id
      INNER JOIN Usuario_Roles ur ON ur.rol_id = rp.rol_id
      WHERE ur.usuario_id = ${user.id}
    `;

    const permisos = permisosResult.recordset.map(p => p.codigo);

    // 4️⃣ Generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        permisos
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 5️⃣ Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
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
        permisos
      }
    });

  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,       // true en producción
    sameSite: 'strict'
  });

  res.json({ message: 'Logout correcto' });
};

module.exports = { login, logout };
