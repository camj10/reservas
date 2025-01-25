import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom'; 

const Navbar = () => {
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Container>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sistema de Reservas
          </Typography>
          <Button component={Link} to="/personas" color="inherit">
            Personas
          </Button>
          <Button component={Link} to="/habitaciones" color="inherit">
            Habitaciones
          </Button>
          <Button component={Link} to="/reservas" color="inherit">
            Reservas
          </Button>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
