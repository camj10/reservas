import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const PersonasList = ({ personas, onEdit, onDelete, onDeleteConfirmation }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre Completo</TableCell>
            <TableCell>Nro Documento</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {personas.map((persona) => (
            <TableRow key={persona.id}>
              <TableCell>{persona.nombrecompleto}</TableCell>
              <TableCell>{persona.nrodocumento}</TableCell>
              <TableCell>{persona.correo}</TableCell>
              <TableCell>{persona.telefono}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => onEdit(persona)}
                  sx={{ mr: 1 }}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => onDeleteConfirmation(persona.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PersonasList;
