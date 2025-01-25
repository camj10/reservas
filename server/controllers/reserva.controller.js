import connection from '../config/db/db.js';

const getAllReservas = async (req, res) => {
  try {
    const db = await connection(); 
    const [reservas] = await db.query('SELECT r.id, r.fechareserva, r.fechaentrada, r.fechasalida, r.montoreserva, r.habitacionid, r.personaid, h.habitacionpiso AS habitacionpiso, h.habitacionnro AS habitacionnro, p.nombrecompleto AS persona_nombre FROM Reserva r JOIN Habitacion h ON r.habitacionid = h.id JOIN Persona p ON r.personaid = p.id');
    res.json(reservas);
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener las reservas', details: err.message });
  }
};

const getReservaById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connection();
    const [reserva] = await db.query('SELECT * FROM reserva WHERE id = ?', [id]);

    if (reserva.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(reserva[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener la reserva', details: err.message });
  }
};

const createReserva = async (req, res) => {
    const { fechaentrada, fechasalida, habitacionid, personaid } = req.body;
  
    if (!fechaentrada || !fechasalida || !habitacionid || !personaid) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
  
    const fechaReserva = new Date(); 
    const formattedFechaReserva = fechaReserva.toISOString().slice(0, 19).replace('T', ' '); // Formato `YYYY-MM-DD HH:mm:ss`
    const dias = (new Date(fechasalida) - new Date(fechaentrada)) / (1000 * 60 * 60 * 24);
  
    if (dias <= 0) {
      return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la fecha de entrada' });
    }
  
    const montoreserva = dias * 120000;
  
    try {
      const db = await connection();
      const [result] = await db.query(
        `INSERT INTO reserva (fechareserva, fechaentrada, fechasalida, habitacionid, personaid, montoreserva) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [formattedFechaReserva, fechaentrada, fechasalida, habitacionid, personaid, montoreserva]
      );
  
      res.status(201).json({ message: 'Reserva creada', id: result.insertId });
    } catch (err) {
      return res.status(500).json({ error: 'Error al crear la reserva', details: err.message });
    }
  };
  
  const updateReserva = async (req, res) => {
    const { id } = req.params;
    const { fechaentrada, fechasalida, habitacionid, personaid } = req.body;
  
    if (!fechaentrada || !fechasalida || !habitacionid || !personaid) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
  
    const dias = (new Date(fechasalida) - new Date(fechaentrada)) / (1000 * 60 * 60 * 24);
  
    if (dias <= 0) {
      return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la fecha de entrada' });
    }
  
    const montoreserva = dias * 120000;
  
    try {
      const db = await connection();
      const [result] = await db.query(
        `UPDATE reserva SET fechaentrada = ?, fechasalida = ?, habitacionid = ?, personaid = ?, montoreserva = ? 
         WHERE id = ?`,
        [fechaentrada, fechasalida, habitacionid, personaid, montoreserva, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
  
      res.json({ message: 'Reserva actualizada correctamente' });
    } catch (err) {
      return res.status(500).json({ error: 'Error al actualizar la reserva', details: err.message });
    }
  };
  

const deleteReserva = async (req, res) => {
  const { id } = req.params;
  const db = await connection();
  try {
    const [result] = await db.query('DELETE FROM reserva WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva eliminada correctamente' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar la reserva', details: err.message });
  }
};


export const checkHabitacionDisponible = async (req, res) => {
  const { habitacionid, fechaentrada, fechasalida } = req.query;

  if (!habitacionid || !fechaentrada || !fechasalida) {
    return res.status(400).json({ error: 'Faltan parámetros necesarios: habitacionid, fechaentrada y fechasalida' });
  }

  const formatFecha = (fecha) => {
    console.log("En formatfecha fecha contiene: ",fecha);
    const fechaLimpia = fecha.replace(/^(.*\d{4})[^\d]+$/, '$1');
    const d = new Date(fechaLimpia);
    if (isNaN(d.getTime())) {
      throw new Error("Fecha no válida");
    }
    return d.toISOString().split('T')[0];
  };
  
  const fechaentradaFormatted = formatFecha(fechaentrada);
  const fechasalidaFormatted = formatFecha(fechasalida);
  
  try {
    const db = await connection();
    const [reservas] = await db.query(
      `SELECT * FROM reserva WHERE habitacionid = ? AND (
        (fechaentrada BETWEEN ? AND ?) OR 
        (fechasalida BETWEEN ? AND ?) OR 
        (? BETWEEN fechaentrada AND fechasalida) OR 
        (? BETWEEN fechaentrada AND fechasalida)
      )`,
      [habitacionid, fechaentradaFormatted, fechasalidaFormatted, fechaentradaFormatted, fechasalidaFormatted, fechaentradaFormatted, fechasalidaFormatted]
    );
    if (reservas.length > 0) {
      return res.json({ isAvailable: false }); 
    }

    return res.json({ isAvailable: true }); 
  } catch (err) {
    return res.status(500).json({ error: 'Error al verificar la disponibilidad de la habitación', details: err.message });
  }
};

export default {
  getAllReservas,
  getReservaById, 
  createReserva,
  updateReserva,
  deleteReserva,
  checkHabitacionDisponible
};
