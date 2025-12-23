const bcrypt = require('bcrypt');
const { sql } = require('../database/connection');

// CREAR
const createUser = async (req, res) => {
  try {
    const { nombre, email, password, roles } = req.body;

    // 🔴 VALIDACIÓN CRÍTICA
    if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({
        message: 'Debe enviar al menos un rol válido'
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await sql.query`
      INSERT INTO Usuarios (nombre, email, password_hash, activo)
      OUTPUT INSERTED.id
      VALUES (${nombre}, ${email}, ${hash}, 1)
    `;

    const userId = result.recordset[0].id;

    // 🔴 FOR SEGURO
    for (const rolId of roles) {
      await sql.query`
        INSERT INTO Usuario_Roles (usuario_id, rol_id)
        VALUES (${userId}, ${Number(rolId)})
      `;
    }

    return res.status(201).json({ message: 'Usuario creado' });

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    return res.status(500).json({ message: 'Error creando usuario' });
  }
};
/* const createUser = async (req, res) => {
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

  res.status(201).json({ message: 'Usuario creado' });
}; */

// EDITAR
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, activo } = req.body;

  await sql.query`
    UPDATE Usuarios
    SET nombre = ${nombre},
        email = ${email},
        activo = ${activo},
        updated_at = GETDATE()
    WHERE id = ${id}
  `;

  res.json({ message: 'Usuario actualizado' });
};

// ELIMINAR (soft delete)
const deleteUser = async (req, res) => {
  const { id } = req.params;

  await sql.query`
    UPDATE Usuarios
    SET activo = 0,
        updated_at = GETDATE()
    WHERE id = ${id}
  `;

  res.json({ message: 'Usuario eliminado' });
};

module.exports = {
  createUser,
  updateUser,
  deleteUser
};
