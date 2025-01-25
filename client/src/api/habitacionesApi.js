const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const fetchHabitaciones = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/habitaciones`);
    if (!response.ok) {
      throw new Error('Error al obtener habitaciones, código de estado: ' + response.status);
    }
    const data = await response.json(); 
    return data.habitaciones || [];
  } catch (error) {
    console.error('Error en fetch:', error);
    return []; 
  }
};


export const createHabitacion = async (habitacion) => {
  try {
    const response = await fetch(`${API_BASE}/api/habitaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(habitacion),
    });

    if (!response.ok) {
      throw new Error('Error al crear habitación, código de estado: ' + response.status);
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error en fetch:', error);
    return null; 
  }
};

export const updateHabitacion = async (id, habitacion) => {
  try {
    const response = await fetch(`${API_BASE}/api/habitaciones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habitacion),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar habitación, código de estado: ' + response.status);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    return null; 
  }
};

export const deleteHabitacion = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/api/habitaciones/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Error al eliminar habitación, código de estado: ' + response.status);
    }
  } catch (error) {
    console.error('Error en fetch:', error);
  }
};
