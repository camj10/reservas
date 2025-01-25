import { Router } from "express";
import reservasAPI from '../controllers/reserva.controller.js';
const { getAllReservas, getReservaById, createReserva, updateReserva, deleteReserva, checkHabitacionDisponible } = reservasAPI;

const router = Router();
router.get('/available/', checkHabitacionDisponible); 
router.get('/:id', getReservaById); 
router.get('/', getAllReservas); 
router.post('/', createReserva);      
router.put('/:id', updateReserva);    
router.delete('/:id', deleteReserva);  

export default router;
