import { Router } from "express"
import habitacionesAPI from '../controllers/habitacion.controller.js'
const { getAllHabitaciones, getHabitacionById, createHabitacion, updateHabitacion, deleteHabitacion } = habitacionesAPI

const router = Router()

router.get('/', getAllHabitaciones); 
router.get('/:id', getHabitacionById); 
router.post('/', createHabitacion);      
router.put('/:id', updateHabitacion);    
router.delete('/:id', deleteHabitacion);  

export default router;