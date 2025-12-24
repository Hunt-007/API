const bcrypt = require('bcrypt');
const { sql } = require('../database/connection');

// CREAR USUARIO
const createUser = async (req, res) => {
  try {
    const { nombre, email, password, roles } = req.body;

    // 🔐 Validaciones mínimas
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({
        message: 'Debe enviar roles como arreglo. Ej: roles: [1]'
      });
    }

    // 🔎 Verificar si el email ya existe
    const existe = await sql.query`
      SELECT id FROM Usuarios WHERE email = ${email}
    `;

    if (existe.recordset.length > 0) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }

    // 🔐 Hash password
    const hash = await bcrypt.hash(password, 10);

    // 👤 Crear usuario
    const result = await sql.query`
      INSERT INTO Usuarios (nombre, email, password_hash, activo)
      OUTPUT INSERTED.id
      VALUES (${nombre}, ${email}, ${hash}, 1)
    `;

    const userId = result.recordset[0].id;

    // 🔗 Asignar roles
    for (const rolId of roles) {
      await sql.query`
        INSERT INTO Usuario_Roles (usuario_id, rol_id)
        VALUES (${userId}, ${rolId})
      `;
    }

    res.status(201).json({
      message: 'Usuario creado correctamente',
      userId
    });

  } catch (error) {
    console.error('ERROR CREATE USER:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

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

// LISTAR usuarios
/* const listUsers = async (req, res) => {
  const result = await sql.query`
    SELECT 
      id,
      nombre,
      email,
      activo,
      created_at
    FROM Usuarios
  `;

  res.json(result.recordset);
}; */
const listUsers = async (req, res) => {
  try {
    // Query params
    const {
      page = 1,
      limit = 10,
      nombre,
      email,
      activo
    } = req.query;

    const offset = (page - 1) * limit;

    // Filtros dinámicos
    let where = 'WHERE 1=1';
    const params = [];

    if (nombre) {
      where += ' AND nombre LIKE @nombre';
      params.push({ name: 'nombre', value: `%${nombre}%` });
    }

    if (email) {
      where += ' AND email LIKE @email';
      params.push({ name: 'email', value: `%${email}%` });
    }

    if (activo !== undefined) {
      where += ' AND activo = @activo';
      params.push({ name: 'activo', value: Number(activo) });
    }

    // Query principal
    const query = `
      SELECT
        id,
        nombre,
        email,
        activo,
        created_at
      FROM Usuarios
      ${where}
      ORDER BY id
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;

    // Total
    const countQuery = `
      SELECT COUNT(*) total
      FROM Usuarios
      ${where}
    `;

    const request = sql.request();

    params.forEach(p => request.input(p.name, p.value));
    request.input('offset', offset);
    request.input('limit', Number(limit));

    const result = await request.query(query);
    const totalResult = await request.query(countQuery);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total: totalResult.recordset[0].total,
      data: result.recordset
    });

  } catch (err) {
    /* console.error(err);
    res.status(500).json({ message: 'Error listando usuarios' }); */
    console.error('❌ ERROR REAL listUsers =====>');
    console.error(err);
    console.error('❌ MESSAGE:', err.message);
    console.error('❌ CODE:', err.code);
    console.error('❌ STACK:', err.stack);

    return res.status(500).json({
      message: 'Error listando usuarios',
      error: err.message
    });
  }
};


// OBTENER USUARIO POR ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  const result = await sql.query`
    SELECT
      id,
      nombre,
      email,
      activo,
      created_at,
      updated_at
    FROM Usuarios
    WHERE id = ${id}
  `;

  if (result.recordset.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.json(result.recordset[0]);
};

// VER MI PERFIL
const getMe = async (req, res) => {
  const userId = req.user.id;

  const result = await sql.query`
    SELECT id, nombre, email, activo, created_at
    FROM Usuarios
    WHERE id = ${userId}
  `;

  if (result.recordset.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.json(result.recordset[0]);
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  listUsers,
  getUserById,
  getMe
};

