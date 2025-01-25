import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const HabitacionesList = ({ habitaciones, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleOpenDialog = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = () => {
    onDelete(selectedId);
    handleCloseDialog();
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Piso</TableCell>
              <TableCell>Número</TableCell>
              <TableCell>Cantidad de Camas</TableCell>
              <TableCell>Televisión</TableCell>
              <TableCell>Frigobar</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {habitaciones.map((habitacion) => (
              <TableRow key={habitacion.id}>
                <TableCell>{habitacion.habitacionpiso}</TableCell>
                <TableCell>{habitacion.habitacionnro}</TableCell>
                <TableCell>{habitacion.cantcamas}</TableCell>
                <TableCell>{habitacion.tienetelevision ? 'Sí' : 'No'}</TableCell>
                <TableCell>{habitacion.tienefrigobar ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onEdit(habitacion)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleOpenDialog(habitacion.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que deseas eliminar esta habitación?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HabitacionesList;

