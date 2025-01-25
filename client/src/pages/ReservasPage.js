import React, { useState, useEffect } from 'react'; 
import { fetchReservas, createReserva, updateReserva, deleteReserva } from '../api/reservaApi';
import ReservaForm from '../components/forms/ReservaForm';
import ReservaList from '../components/lists/ReservasList';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';

const ReservaPage = () => {
  const [reservas, setReservas] = useState([]);
  const [editingReserva, setEditingReserva] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchReservas()
      .then((data) => {
        if (isMounted) {
          setReservas(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError('Hubo un error al cargar las reservas.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddReserva = (reserva) => {
    createReserva(reserva)
      .then((newReserva) => {
        if (newReserva) {
          setReservas([...reservas, newReserva]);
          setShowForm(false);
          setSuccessMessage('Reserva creada exitosamente');
        } else {
          setError('No se pudo crear la reserva.');
        }
      })
      .catch(() => {
        setError('Hubo un error al crear la reserva.');
      });
  };

  const handleUpdateReserva = (updatedReserva) => {
    updateReserva(editingReserva.id, updatedReserva)
      .then(() => {
        setReservas(reservas.map((r) => (r.id === editingReserva.id ? updatedReserva : r)));
        setEditingReserva(null);
        setShowForm(false);
        setSuccessMessage('Reserva actualizada exitosamente');
      })
      .catch(() => {
        setError('Hubo un error al actualizar la reserva.');
      });
  };

  const handleDeleteReserva = (id) => {
    if (!id) {
      console.error("ID de la reserva no proporcionado");
      return;
    }
    deleteReserva(id)
      .then(() => {
        setReservas(reservas.filter((r) => r.id !== id));
        setSuccessMessage('Reserva eliminada exitosamente');
      })
      .catch(() => {
        setError('Hubo un error al eliminar la reserva.');
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Reservas
      </Typography>
      {!showForm && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingReserva(null);
            setShowForm(true);
          }}
          sx={{ mb: 2 }}
        >
          Agregar Reserva
        </Button>
      )}
      {showForm && (
        <ReservaForm
          onSubmit={editingReserva ? handleUpdateReserva : handleAddReserva}
          initialData={editingReserva}
        />
      )}
      <ReservaList
        reservas={reservas}
        onEdit={(reserva) => {
          setEditingReserva(reserva);
          setShowForm(true);
        }}
        onDelete={(id) => handleDeleteReserva(id)}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
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

export default ReservaPage;