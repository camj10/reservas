const API_BASE = 'http://localhost:3000'; 
export const fetchPersonas = async () => {
  const response = await fetch(`${API_BASE}/api/personas`);
  return response.json();
};

export const createPersona = async (persona) => {
  try {
    const response = await fetch('http://localhost:3000/api/personas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(persona),
    });

    if (!response.ok) {
      throw new Error('Error al crear persona, código de estado: ' + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en fetch:', error);
    return null; 
  }
};


export const updatePersona = async (id, persona) => {
  const response = await fetch(`${API_BASE}/api/personas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(persona),
  });
  return response.json();
};

export const deletePersona = async (id) => {
  await fetch(`${API_BASE}/api/personas/${id}`, { method: 'DELETE' });
};