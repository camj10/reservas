import React, { useState, useEffect } from 'react';
import { fetchPersonas, createPersona, updatePersona, deletePersona } from '../api/personasApi';
import PersonaForm from '../components/forms/PersonaForm';
import PersonasList from '../components/lists/PersonasList';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Alert, Snackbar } from '@mui/material';

const PersonasPage = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [editingPersona, setEditingPersona] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); 
  const [personaToDelete, setPersonaToDelete] = useState(null); 
  useEffect(() => {
    fetchPersonas().then(setPersonas);
  }, []);

  const handleAddPersona = (persona) => {
    createPersona(persona).then((newPersona) => {
      if (newPersona) {
        setPersonas([...personas, newPersona]);
        setShowForm(false); 
      } else {
        console.error('No se pudo crear la persona.');
      }
    });
  };

  const handleUpdatePersona = (updatedPersona) => {
    updatePersona(editingPersona.id, updatedPersona).then(() => {
      setPersonas(personas.map((p) => (p.id === editingPersona.id ? updatedPersona : p)));
      setEditingPersona(null);
      setShowForm(false); 
    });
  };

  const handleDeletePersona = () => {
    if (personaToDelete) {
      deletePersona(personaToDelete).then(() => {
        setPersonas(personas.filter((p) => p.id !== personaToDelete));
        setOpenDialog(false); 
        setSuccessMessage('Persona eliminada del sistema');
      });
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false); 
    setPersonaToDelete(null); 
  };

  const handleDeleteConfirmation = (id) => {
    setPersonaToDelete(id); 
    setOpenDialog(true); 
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Personas
      </Typography>

      {!showForm && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingPersona(null); 
            setShowForm(true); 
          }}
          sx={{ mb: 2 }}
        >
          Agregar Persona
        </Button>
      )}

      {showForm && (
        <PersonaForm
          onSubmit={editingPersona ? handleUpdatePersona : handleAddPersona}
          initialData={editingPersona}
        />
      )}

      <PersonasList
        personas={personas}
        onEdit={(persona) => {
          setEditingPersona(persona);
          setShowForm(true);
        }}
        onDeleteConfirmation={handleDeleteConfirmation} 
      />

      {/* Modal de confirmación */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que deseas eliminar esta persona?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleDeletePersona} color="error">
            Sí
          </Button>
        </DialogActions>
      </Dialog>
            
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

export default PersonasPage;
