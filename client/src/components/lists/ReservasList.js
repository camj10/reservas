import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const ReservaList = ({ reservas, onEdit, onDelete }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [reservaToDelete, setReservaToDelete] = useState(null); 

  const handleDeleteClick = (reservaId) => {
    setReservaToDelete(reservaId); 
    setOpenDialog(true); 
  };

  const handleConfirmDelete = () => {
    if (reservaToDelete) {
      onDelete(reservaToDelete); 
      setOpenDialog(false); 
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false); 
    setReservaToDelete(null); 
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha Reserva</TableCell>
              <TableCell>Fecha Entrada</TableCell>
              <TableCell>Fecha Salida</TableCell>
              <TableCell>Habitación</TableCell>
              <TableCell>Persona</TableCell>
              <TableCell>Monto Reserva</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservas.map((reserva, index) => (
              <TableRow key={index}>
                <TableCell>{reserva.fechareserva}</TableCell>
                <TableCell>{reserva.fechaentrada}</TableCell>
                <TableCell>{reserva.fechasalida}</TableCell>
                <TableCell>Piso: {reserva.habitacionpiso}, Habitación: {reserva.habitacionnro}</TableCell>
                <TableCell>{reserva.persona_nombre}</TableCell>
                <TableCell>{reserva.montoreserva} Gs.</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onEdit(reserva)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteClick(reserva.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que deseas eliminar esta reserva?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
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

export default ReservaList;
