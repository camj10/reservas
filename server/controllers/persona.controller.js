import connection from '../config/db/db.js';

const getAllPersonas = async (req, res) => {
  try {
    const db = await connection();  
    const [personas] = await db.query('SELECT * FROM persona');  
    res.json(personas);  
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener las personas', details: err.message });
  }
};

const getPersonaById = async (req, res) => {
    const { id } = req.params;
    try {
      const db = await connection();
      const [persona] = await db.query('SELECT * FROM persona WHERE id = ?', [id]);
  
      if (persona.length === 0) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
  
      res.json(persona[0]);
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener la persona', details: err.message });
    }
  };

  const createPersona = async (req, res) => {
    const { nombrecompleto, nrodocumento, correo, telefono } = req.body;
  
    if (!nombrecompleto || !nrodocumento) {
      return res.status(400).json({ error: 'Los campos nombrecompleto, nrodocumento son obligatorios' });
    }
    
    const db = await connection();  
    const [existingPersonas] = await db.query(
      'SELECT * FROM persona WHERE nrodocumento = ?',
      [nrodocumento]
    );
  
    if (existingPersonas.length > 0) {
      return res.status(400).json({ error: 'El número de documento ya existe' });
    }
  
    try {
      const [result] = await db.query(
        'INSERT INTO persona (nombrecompleto, nrodocumento, correo, telefono) VALUES (?, ?, ?, ?)',
        [nombrecompleto, nrodocumento, correo, telefono]
      );
  
      const [newPersona] = await db.query(
        'SELECT * FROM persona WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json(newPersona[0]);
    } catch (err) {
      return res.status(500).json({ error: 'Error al crear la persona', details: err.message });
    }
  };
  

const updatePersona = async (req, res) => {
    const { id } = req.params;
    const { nombrecompleto, nrodocumento, correo, telefono } = req.body;
  
    if (!nombrecompleto || !nrodocumento) {
      return res.status(400).json({ error: 'Los campos nombrecompleto, nrodocumento son obligatorios' });
    }
  
    try {
        const db = await connection();  
        const [result] = await db.query(
          'UPDATE persona SET nombrecompleto = ?, nrodocumento = ?, correo = ?, telefono = ? WHERE id = ?',
          [nombrecompleto, nrodocumento, correo, telefono, id]
        );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
  
      res.json({ message: 'Persona actualizada correctamente' });
    } catch (err) {
        return  res.status(500).json({ error: 'Error al actualizar la persona', details: err.message });
    }
  };


const deletePersona = async (req, res) => {
    const { id } = req.params;
    const db = await connection();  
    try {
      const [result] = await db.query('DELETE FROM persona WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
  
      res.json({ message: 'Persona eliminada correctamente' });
    } catch (err) {
        return res.status(500).json({ error: 'Error al eliminar la persona', details: err.message });
    }
  };
  
export default {
    getAllPersonas,
    getPersonaById,
    createPersona,
    updatePersona,
    deletePersona
  };
