import { Router } from "express"
import { PessoaController } from "../controllers/PessoaController.controller"

const router = Router()
const pessoasController = new PessoaController

router.post('/', pessoasController.create)
router.get('/', pessoasController.getAll)
router.get('/:id', pessoasController.getById)
router.put('/:id', pessoasController.update)
router.get('/:id', pessoasController.delete)

export default router