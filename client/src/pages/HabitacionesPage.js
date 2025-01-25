import React, { useState, useEffect } from 'react';
import { fetchHabitaciones, createHabitacion, updateHabitacion, deleteHabitacion } from '../api/habitacionesApi';
import HabitacionForm from '../components/forms/HabitacionForm';
import HabitacionesList from '../components/lists/HabitacionesList';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';

const HabitacionesPage = () => {
  const [habitaciones, setHabitaciones] = useState([]); 
  const [editingHabitacion, setEditingHabitacion] = useState(null); 
  const [showForm, setShowForm] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(null);
  
  useEffect(() => {
    const cargarHabitaciones = async () => {
      const data = await fetchHabitaciones();
      setHabitaciones(Array.isArray(data) ? data : []); 
    };
    cargarHabitaciones();
  }, []);

  
  const handleAddHabitacion = (habitacion) => {
    createHabitacion(habitacion).then((newHabitacion) => {
      if (newHabitacion) {
        setHabitaciones((prev) => [...prev, newHabitacion]); 
        setShowForm(false); 
      } else {
        console.error('No se pudo crear la habitación.');
      }
    });
  };

  
  const handleUpdateHabitacion = (updatedHabitacion) => {
    updateHabitacion(editingHabitacion.id, updatedHabitacion).then(() => {
      setHabitaciones((prev) =>
        prev.map((h) => (h.id === editingHabitacion.id ? updatedHabitacion : h))
      );
      setEditingHabitacion(null);
      setShowForm(false); 
    });
  };

 
  const handleDeleteHabitacion = (id) => {
    deleteHabitacion(id).then(() =>{
    setHabitaciones((prev) => prev.filter((h) => h.id !== id))
    setSuccessMessage('Habitación eliminada');
    }
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Habitaciones
      </Typography>

    
      {!showForm && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingHabitacion(null); 
            setShowForm(true); 
          }}
          sx={{ mb: 2 }}
        >
          Agregar Habitación
        </Button>
      )}

     
      {showForm && (
        <HabitacionForm
          onSubmit={editingHabitacion ? handleUpdateHabitacion : handleAddHabitacion}
          initialData={editingHabitacion}
        />
      )}

      
      <HabitacionesList
        habitaciones={habitaciones}
        onEdit={(habitacion) => {
          setEditingHabitacion(habitacion);
          setShowForm(true);
        }}
        onDelete={handleDeleteHabitacion}
      />
      
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HabitacionesPage;