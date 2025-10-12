import { Router } from "express"
import { CursoController } from "../controllers/CursoController.controller"

const router = Router()
const cursosController = new CursoController

router.post('/', cursosController.create)
router.get('/', cursosController.getAll)
router.get('/:id', cursosController.getById)
router.put('/:id', cursosController.update)
router.get('/:id', cursosController.delete)

export default router