import { Router } from "express"
import personasAPI from '../controllers/persona.controller.js'
const { getAllPersonas, getPersonaById, createPersona, updatePersona, deletePersona } = personasAPI

const router = Router()

router.get('/', getAllPersonas); 
router.get('/:id', getPersonaById); 
router.post('/', createPersona);      
router.put('/:id', updatePersona);    
router.delete('/:id', deletePersona);  

export default router;