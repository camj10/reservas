import connection from '../config/db/db.js';

const getAllHabitaciones = async (req, res) => {
  try {
    const db = await connection();
    const [habitaciones] = await db.query('SELECT * FROM habitacion');
    return res.json({habitaciones});
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener las habitaciones', details: err.message });
  }
};


const getHabitacionById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connection();
    const [habitacion] = await db.query('SELECT * FROM habitacion WHERE id = ?', [id]);

    if (habitacion.length === 0) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    res.json(habitacion[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener la habitación', details: err.message });
  }
};

const createHabitacion = async (req, res) => {
  const { habitacionpiso, habitacionnro, cantcamas, tienetelevision, tienefrigobar } = req.body;

  if (!habitacionpiso || !habitacionnro || !cantcamas) {
    return res.status(400).json({ error: 'Los campos habitacionpiso, habitacionnro y cantcamas son obligatorios' });
  }

  if (habitacionpiso < 1 || habitacionpiso > 10 || habitacionnro < 1 || habitacionnro > 20 || cantcamas < 1 || cantcamas > 4) {
    return res.status(400).json({ error: 'Los valores de habitacionpiso, habitacionnro y cantcamas no son válidos' });
  }

  const db = await connection();
  try {
    const [result] = await db.query(
      'INSERT INTO habitacion (habitacionpiso, habitacionnro, cantcamas, tienetelevision, tienefrigobar) VALUES (?, ?, ?, ?, ?)',
      [habitacionpiso, habitacionnro, cantcamas, tienetelevision, tienefrigobar]
    );
    
  
    const [newHabitacion] = await db.query(
      'SELECT * FROM habitacion WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newHabitacion[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Error al crear la habitación', details: err.message });
  }
};

const updateHabitacion = async (req, res) => {
  const { id } = req.params;
  const { habitacionpiso, habitacionnro, cantcamas, tienetelevision, tienefrigobar } = req.body;

  if (habitacionpiso < 1 || habitacionpiso > 10 || habitacionnro < 1 || habitacionnro > 20 || cantcamas < 1 || cantcamas > 4) {
    return res.status(400).json({ error: 'Los valores de habitacionpiso, habitacionnro y cantcamas no son válidos' });
  }

  try {
    const db = await connection();
    const [result] = await db.query(
      'UPDATE habitacion SET habitacionpiso = ?, habitacionnro = ?, cantcamas = ?, tienetelevision = ?, tienefrigobar = ? WHERE id = ?',
      [habitacionpiso, habitacionnro, cantcamas, tienetelevision, tienefrigobar, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    res.json({ message: 'Habitación actualizada correctamente' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al actualizar la habitación', details: err.message });
  }
};

const deleteHabitacion = async (req, res) => {
  const { id } = req.params;
  const db = await connection();
  try {
    const [result] = await db.query('DELETE FROM habitacion WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    res.json({ message: 'Habitación eliminada correctamente' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar la habitación', details: err.message });
  }
};


export default {
  getAllHabitaciones,
  getHabitacionById,
  createHabitacion,
  updateHabitacion,
  deleteHabitacion
};
