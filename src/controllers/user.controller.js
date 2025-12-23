const bcrypt = require('bcrypt');
const { sql } = require('../database/connection');

const createUser = async (req, res) => {
  const { nombre, email, password, roles } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const result = await sql.query`
    INSERT INTO Usuarios (nombre, email, password_hash, activo)
    OUTPUT INSERTED.id
    VALUES (${nombre}, ${email}, ${hash}, 1)
  `;

  const userId = result.recordset[0].id;

  for (const rolId of roles) {
    await sql.query`
      INSERT INTO Usuario_Roles (usuario_id, rol_id)
      VALUES (${userId}, ${rolId})
    `;
  }

  res.status(201).json({ message: 'Usuario creado correctamente' });
};

module.exports = {
  createUser
};
