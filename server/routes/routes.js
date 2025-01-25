import { Router } from "express"
import personaRoutes from './persona.routes.js'
import habitacionRoutes from './habitacion.routes.js'
import reservaRoutes from './reserva.routes.js'

const router = Router()

router.use('/personas', personaRoutes);
router.use('/habitaciones', habitacionRoutes);
router.use('/reservas', reservaRoutes);

export default router
