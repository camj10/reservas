import React, { useState, useEffect } from 'react'; 
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import { fetchHabitaciones } from '../../api/habitacionesApi';
import { fetchPersonas } from '../../api/personasApi';

const formatFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toISOString().split('T')[0];
};

const checkHabitacionDisponible = async (habitacionId, fechaentrada, fechasalida) => {
  try {
    const response = await fetch(`http://localhost:3000/api/reservas/available?habitacionid=${habitacionId}&fechaentrada=${fechaentrada}&fechasalida=${fechasalida}`);
    const data = await response.json();
    return data.isAvailable;
  } catch (error) {
    console.error("Error verificando disponibilidad de la habitación", error);
    return false;
  }
};

const ReservaForm = ({ onSubmit, initialData = null }) => {
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    fetchHabitaciones().then((data) => setHabitacionesDisponibles(data || []));
    fetchPersonas().then((data) => setPersonas(data || []));
  }, []);

  const reservaValidationSchema = Yup.object({
    fechaentrada: Yup.date()
      .required('La fecha de entrada es obligatoria')
      .min(new Date(), 'La fecha de entrada debe ser posterior al día actual'),
    fechasalida: Yup.date()
      .required('La fecha de salida es obligatoria')
      .min(Yup.ref('fechaentrada'), 'La fecha de salida debe ser posterior a la fecha de entrada'),
    habitacionid: Yup.string()
      .required('Debes seleccionar una habitación')
      .test('habitaciondisponible', 'La habitación no está disponible en el rango de fechas seleccionado', async (value, context) => {
        if (!value) return false; 
        const isAvailable = await checkHabitacionDisponible(value, context.parent.fechaentrada, context.parent.fechasalida);
        return isAvailable;
      }),
    personaid: Yup.string().required('Debes seleccionar una persona'),
    montoreserva: Yup.number().test('calculoMonto', 'El monto de la reserva es incorrecto', function(value) {
      const { fechaentrada, fechasalida } = this.parent;
      if (!fechaentrada || !fechasalida) return true;
      const diferenciaDias = Math.ceil((new Date(fechasalida) - new Date(fechaentrada)) / (1000 * 3600 * 24));
      const montoCalculado = diferenciaDias * 120000;
      return value === montoCalculado;
    }),
  });

  const formik = useFormik({
    initialValues: {
      fechareserva: initialData ? formatFecha(initialData.fechareserva) : new Date().toISOString().split('T')[0],
      fechaentrada: initialData ? formatFecha(initialData.fechaentrada) : '',
      fechasalida: initialData ? formatFecha(initialData.fechasalida) : '',
      habitacionid: initialData?.habitacionid || '',
      personaid: initialData?.personaid || '',
      montoreserva: initialData?.montoreserva || '',
    },
    validationSchema: reservaValidationSchema,
    onSubmit,
  });

  const calcularMontoReserva = (fechaentrada, fechasalida) => {
    if (!fechaentrada || !fechasalida) return;
    const diferenciaDias = Math.ceil((new Date(fechasalida) - new Date(fechaentrada)) / (1000 * 3600 * 24));
    const montoCalculado = diferenciaDias * 120000;
    formik.setFieldValue('montoreserva', montoCalculado); 
  };
  
  useEffect(() => {
    calcularMontoReserva(formik.values.fechaentrada, formik.values.fechasalida);
  }, [formik.values.fechaentrada, formik.values.fechasalida]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="Fecha de Entrada"
        type="date"
        {...formik.getFieldProps('fechaentrada')}
        error={formik.touched.fechaentrada && Boolean(formik.errors.fechaentrada)}
        helperText={formik.touched.fechaentrada && formik.errors.fechaentrada}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Fecha de Salida"
        type="date"
        {...formik.getFieldProps('fechasalida')}
        error={formik.touched.fechasalida && Boolean(formik.errors.fechasalida)}
        helperText={formik.touched.fechasalida && formik.errors.fechasalida}
        sx={{ mb: 2 }}
      />
      <TextField
        select
        fullWidth
        label="Habitación"
        {...formik.getFieldProps('habitacionid')}
        value={formik.values.habitacionid}
        error={formik.touched.habitacionid && Boolean(formik.errors.habitacionid)}
        helperText={formik.touched.habitacionid && formik.errors.habitacionid}
        sx={{ mb: 2 }}
      >
        {habitacionesDisponibles.length > 0 ? (
          habitacionesDisponibles.map((habitacion) => (
            <MenuItem key={habitacion.id} value={habitacion.id}>
              {`Piso ${habitacion.habitacionpiso}, Habitación ${habitacion.habitacionnro}`}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="">No hay habitaciones disponibles</MenuItem>
        )}
      </TextField>
      <TextField
        select
        fullWidth
        label="Persona"
        {...formik.getFieldProps('personaid')}
        value={formik.values.personaid}
        error={formik.touched.personaid && Boolean(formik.errors.personaid)}
        helperText={formik.touched.personaid && formik.errors.personaid}
        sx={{ mb: 2 }}
      >
        {personas.length > 0 ? (
          personas.map((persona) => (
            <MenuItem key={persona.id} value={persona.id}>
              {persona.nombrecompleto}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="">No hay personas disponibles</MenuItem>
        )}
      </TextField>
      <TextField
        fullWidth
        label="Monto de Reserva (Gs.)"
        {...formik.getFieldProps('montoreserva')}
        error={formik.touched.montoreserva && Boolean(formik.errors.montoreserva)}
        helperText={formik.touched.montoreserva && formik.errors.montoreserva}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        {initialData ? 'Actualizar' : 'Crear'}
      </Button>
    </Box>
  );
};

export default ReservaForm;

// import React, { useState, useEffect } from 'react'; 
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { Box, TextField, Button, MenuItem } from '@mui/material';
// import { fetchHabitaciones } from '../../api/habitacionesApi';
// import { fetchPersonas } from '../../api/personasApi';

// const formatFecha = (fecha) => {
//   if (!fecha) return '';
//   const date = new Date(fecha);
//   return date.toISOString().split('T')[0];
// };

// const checkHabitacionDisponible = async (habitacionId, fechaentrada, fechasalida) => {
//   try {
//     const response = await fetch(`http://localhost:3000/api/reservas/available?habitacionid=${habitacionId}&fechaentrada=${fechaentrada}&fechasalida=${fechasalida}`);
//     const data = await response.json();
//     return data.isAvailable;
//   } catch (error) {
//     console.error("Error verificando disponibilidad de la habitación", error);
//     return false;
//   }
// };

// const ReservaForm = ({ onSubmit, initialData = null }) => {
//   const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);
//   const [personas, setPersonas] = useState([]);

//   useEffect(() => {
//     fetchHabitaciones().then((data) => setHabitacionesDisponibles(data || []));
//     fetchPersonas().then((data) => setPersonas(data || []));
//   }, []);

//   const reservaValidationSchema = Yup.object({
//     fechaentrada: Yup.date()
//       .required('La fecha de entrada es obligatoria')
//       .min(new Date(), 'La fecha de entrada debe ser posterior al día actual'),
//     fechasalida: Yup.date()
//       .required('La fecha de salida es obligatoria')
//       .min(Yup.ref('fechaentrada'), 'La fecha de salida debe ser posterior a la fecha de entrada'),
//     habitacionid: Yup.string()
//       .required('Debes seleccionar una habitación')
//       .test('habitaciondisponible', 'La habitación no está disponible en el rango de fechas seleccionado', async (value, context) => {
//         if (!value) return false; 
//         const isAvailable = await checkHabitacionDisponible(value, context.parent.fechaentrada, context.parent.fechasalida);
//         return isAvailable;
//       }),
//     personaid: Yup.string().required('Debes seleccionar una persona'),
//     montoreserva: Yup.number().test('calculoMonto', 'El monto de la reserva es incorrecto', function(value) {
//       const { fechaentrada, fechasalida } = this.parent;
//       if (!fechaentrada || !fechasalida) return true;
//       const diferenciaDias = Math.ceil((new Date(fechasalida) - new Date(fechaentrada)) / (1000 * 3600 * 24));
//       const montoCalculado = diferenciaDias * 120000;
//       return value === montoCalculado;
//     }),
//   });

//   const formik = useFormik({
//     initialValues: {
//       fechareserva: initialData ? formatFecha(initialData.fechareserva) : new Date().toISOString().split('T')[0],
//       fechaentrada: initialData ? formatFecha(initialData.fechaentrada) : '',
//       fechasalida: initialData ? formatFecha(initialData.fechasalida) : '',
//       habitacionid: initialData?.habitacionid || '',
//       personaid: initialData?.personaid || '',
//       montoreserva: initialData?.montoreserva || '',
//     },
//     validationSchema: reservaValidationSchema,
//     onSubmit,
//   });

//   const calcularMontoReserva = (fechaentrada, fechasalida) => {
//     if (!fechaentrada || !fechasalida) return;
//     const diferenciaDias = Math.ceil((new Date(fechasalida) - new Date(fechaentrada)) / (1000 * 3600 * 24));
//     const montoCalculado = diferenciaDias * 120000;
//     formik.setFieldValue('montoreserva', montoCalculado); 
//   };
  
//   useEffect(() => {
//     calcularMontoReserva(formik.values.fechaentrada, formik.values.fechasalida);
//   }, [formik.values.fechaentrada, formik.values.fechasalida, calcularMontoReserva]);

//   return (
//     <Box component="form" onSubmit={formik.handleSubmit} sx={{ mb: 3 }}>
//       <TextField
//         fullWidth
//         label="Fecha de Entrada"
//         type="date"
//         {...formik.getFieldProps('fechaentrada')}
//         error={formik.touched.fechaentrada && Boolean(formik.errors.fechaentrada)}
//         helperText={formik.touched.fechaentrada && formik.errors.fechaentrada}
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         fullWidth
//         label="Fecha de Salida"
//         type="date"
//         {...formik.getFieldProps('fechasalida')}
//         error={formik.touched.fechasalida && Boolean(formik.errors.fechasalida)}
//         helperText={formik.touched.fechasalida && formik.errors.fechasalida}
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         select
//         fullWidth
//         label="Habitación"
//         {...formik.getFieldProps('habitacionid')}
//         value={formik.values.habitacionid}
//         error={formik.touched.habitacionid && Boolean(formik.errors.habitacionid)}
//         helperText={formik.touched.habitacionid && formik.errors.habitacionid}
//         sx={{ mb: 2 }}
//       >
//         {habitacionesDisponibles.length > 0 ? (
//           habitacionesDisponibles.map((habitacion) => (
//             <MenuItem key={habitacion.id} value={habitacion.id}>
//               {`Piso ${habitacion.habitacionpiso}, Habitación ${habitacion.habitacionnro}`}
//             </MenuItem>
//           ))
//         ) : (
//           <MenuItem value="">No hay habitaciones disponibles</MenuItem>
//         )}
//       </TextField>
//       <TextField
//         select
//         fullWidth
//         label="Persona"
//         {...formik.getFieldProps('personaid')}
//         value={formik.values.personaid}
//         error={formik.touched.personaid && Boolean(formik.errors.personaid)}
//         helperText={formik.touched.personaid && formik.errors.personaid}
//         sx={{ mb: 2 }}
//       >
//         {personas.length > 0 ? (
//           personas.map((persona) => (
//             <MenuItem key={persona.id} value={persona.id}>
//               {persona.nombrecompleto}
//             </MenuItem>
//           ))
//         ) : (
//           <MenuItem value="">No hay personas disponibles</MenuItem>
//         )}
//       </TextField>
//       <TextField
//         fullWidth
//         label="Monto de Reserva (Gs.)"
//         {...formik.getFieldProps('montoreserva')}
//         error={formik.touched.montoreserva && Boolean(formik.errors.montoreserva)}
//         helperText={formik.touched.montoreserva && formik.errors.montoreserva}
//         sx={{ mb: 2 }}
//       />
//       <Button type="submit" variant="contained" color="primary">
//         {initialData ? 'Actualizar' : 'Crear'}
//       </Button>
//     </Box>
//   );
// };

// export default ReservaForm;
