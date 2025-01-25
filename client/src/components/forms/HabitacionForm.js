import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Snackbar, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const validationSchema = Yup.object().shape({
  habitacionpiso: Yup.number()
    .required('El piso es obligatorio')
    .integer('Debe ser un número entero')
    .min(1, 'El piso debe ser mayor o igual a 1')
    .max(10, 'El piso debe ser menor o igual a 10'),
  habitacionnro: Yup.number()
    .required('El número de habitación es obligatorio')
    .integer('Debe ser un número entero')
    .min(1, 'El número de habitación debe ser mayor o igual a 1')
    .max(20, 'El número de habitación debe ser menor o igual a 20'),
  cantcamas: Yup.number()
    .required('La cantidad de camas es obligatoria')
    .integer('Debe ser un número entero')
    .min(1, 'Debe haber al menos 1 cama')
    .max(4, 'No puede haber más de 4 camas'),
  tienetelevision: Yup.boolean(),
  tienefrigobar: Yup.boolean(),
});

const HabitacionForm = ({ onSubmit, onDelete, initialData = {} }) => {
  const [openDialog, setOpenDialog] = useState(false); 
  const [snackbarOpen, setSnackbarOpen] = useState(false); 

  const formik = useFormik({
    initialValues: {
      habitacionpiso: initialData?.habitacionpiso || '',
      habitacionnro: initialData?.habitacionnro || '',
      cantcamas: initialData?.cantcamas || '',
      tienetelevision: initialData?.tienetelevision || false,
      tienefrigobar: initialData?.tienefrigobar || false,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    formik.setValues({
      habitacionpiso: initialData?.habitacionpiso || '',
      habitacionnro: initialData?.habitacionnro || '',
      cantcamas: initialData?.cantcamas || '',
      tienetelevision: initialData?.tienetelevision || false,
      tienefrigobar: initialData?.tienefrigobar || false,
    });
  }, [initialData]);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(initialData?.id);
    }
    setOpenDialog(false);
    setSnackbarOpen(true); 
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Piso"
        name="habitacionpiso"
        value={formik.values.habitacionpiso}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.habitacionpiso && Boolean(formik.errors.habitacionpiso)}
        helperText={formik.touched.habitacionpiso && formik.errors.habitacionpiso}
        type="number"
        required
      />
      <TextField
        label="Número de habitación"
        name="habitacionnro"
        value={formik.values.habitacionnro}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.habitacionnro && Boolean(formik.errors.habitacionnro)}
        helperText={formik.touched.habitacionnro && formik.errors.habitacionnro}
        type="number"
        required
      />
      <TextField
        label="Cantidad de camas"
        name="cantcamas"
        value={formik.values.cantcamas}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.cantcamas && Boolean(formik.errors.cantcamas)}
        helperText={formik.touched.cantcamas && formik.errors.cantcamas}
        type="number"
        required
      />
      <FormControlLabel
        control={
          <Checkbox
            name="tienetelevision"
            checked={formik.values.tienetelevision}
            onChange={formik.handleChange}
          />
        }
        label="Tiene televisión"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="tienefrigobar"
            checked={formik.values.tienefrigobar}
            onChange={formik.handleChange}
          />
        }
        label="Tiene frigobar"
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Guardar
        </Button>
        <Button variant="outlined" color="error" onClick={handleDialogOpen}>
          Eliminar
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar esta habitación? Esta acción no se puede deshacer.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity="success" elevation={6} variant="filled">
          La habitación ha sido eliminada correctamente.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default HabitacionForm;
