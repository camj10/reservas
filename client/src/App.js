import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import PersonasPage from './pages/PersonasPage';
import HabitacionesPage from './pages/HabitacionesPage'; 
import ReservasPage from './pages/ReservasPage'; 

const App = () => {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/personas" element={<PersonasPage />} />
        <Route path="/habitaciones" element={<HabitacionesPage />} />
        <Route path="/reservas" element={<ReservasPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;
