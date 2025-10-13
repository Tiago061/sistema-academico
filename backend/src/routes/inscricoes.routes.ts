import { Router } from "express"
import { InscricaoController } from "../controllers/inscricao.controller"

const router = Router()
const inscricoesController = new InscricaoController

router.get('/', (req, res, next) => inscricoesController.getAll(req, res, next));
router.get('/:id', (req, res, next) => inscricoesController.getById(req, res, next));
router.post('/', (req, res, next) => inscricoesController.create(req, res, next));
router.put('/:id', (req, res, next) => inscricoesController.update(req, res, next));
router.delete('/:id', (req, res, next) => inscricoesController.delete(req, res, next));

export default router