import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';


const validationSchema = Yup.object({
  nombrecompleto: Yup.string().required('El nombre completo es obligatorio'),
  nrodocumento: Yup.string().required('El número de documento es obligatorio'),
  correo: Yup.string().email('Correo no válido').required('El correo es obligatorio'),
  telefono: Yup.string().required('El teléfono es obligatorio'),
});

const PersonaForm = ({ onSubmit, initialData = {} }) => {
  const safeInitialData = initialData || {};

  const formik = useFormik({
    initialValues: {
      nombrecompleto: safeInitialData.nombrecompleto || '',
      nrodocumento: safeInitialData.nrodocumento || '',
      correo: safeInitialData.correo || '',
      telefono: safeInitialData.telefono || '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm(); 
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        maxWidth: 400,
        margin: 'auto',
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {/* Aquí verificamos si safeInitialData tiene alguna propiedad, para decidir si es agregar o actualizar */}
        {Object.keys(safeInitialData).length ? 'Actualizar Persona' : 'Agregar Persona'}
      </Typography>

      <TextField
        fullWidth
        label="Nombre Completo"
        name="nombrecompleto"
        value={formik.values.nombrecompleto}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nombrecompleto && Boolean(formik.errors.nombrecompleto)}
        helperText={formik.touched.nombrecompleto && formik.errors.nombrecompleto}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Nro Documento"
        name="nrodocumento"
        value={formik.values.nrodocumento}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nrodocumento && Boolean(formik.errors.nrodocumento)}
        helperText={formik.touched.nrodocumento && formik.errors.nrodocumento}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Correo"
        name="correo"
        type="email"
        value={formik.values.correo}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.correo && Boolean(formik.errors.correo)}
        helperText={formik.touched.correo && formik.errors.correo}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Teléfono"
        name="telefono"
        value={formik.values.telefono}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.telefono && Boolean(formik.errors.telefono)}
        helperText={formik.touched.telefono && formik.errors.telefono}
        sx={{ mb: 2 }}
      />

      <Button type="submit" variant="contained" color="primary" fullWidth>
        {Object.keys(safeInitialData).length ? 'Actualizar' : 'Guardar'}
      </Button>
    </Box>
  );
}; 

export default PersonaForm;
