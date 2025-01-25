const API_BASE = 'http://localhost:3000';

export const fetchReservas = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/reservas`);
    if (!response.ok) {
      throw new Error('Error al obtener reservas, código de estado: ' + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error('Error en fetch:', error);
    return []; 
  }
};

export const createReserva = async (reserva) => {
  try {
    const response = await fetch(`${API_BASE}/api/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reserva),
    });

    if (!response.ok) {
      throw new Error('Error al crear reserva, código de estado: ' + response.status);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error en fetch:', error);
    return null; 
  }
};

export const updateReserva = async (id, reserva) => {
  try {
    const response = await fetch(`${API_BASE}/api/reservas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reserva),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar reserva, código de estado: ' + response.status);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error en fetch:', error);
    return null; 
  }
};

export const deleteReserva = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/api/reservas/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error('Error al eliminar reserva, código de estado: ' + response.status);
    }
  } catch (error) {
    console.error('Error en fetch:', error);
  }
};
