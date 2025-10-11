import { Router } from "express"
import { InscricaoController } from "../controllers/InscricaoController.controller"

const router = Router()
const inscricoesController = new InscricaoController

router.post('/', inscricoesController.create)
router.get('/', inscricoesController.getAll)
router.get('/:id', inscricoesController.getById)
router.put('/:id', inscricoesController.update)
router.get('/:id', inscricoesController.delete)

export default router