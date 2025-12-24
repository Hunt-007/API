/**
 * Valida que :id sea un entero positivo
 */
const validateId = (req, res, next) => {
  const { id } = req.params;

  // Solo números enteros positivos
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({
      message: 'ID inválido'
    });
  }

  // Guardamos el ID limpio
  req.params.id = parsedId;

  next();
};

module.exports = validateId;
