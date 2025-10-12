import { Router } from "express"
import { CursoController } from "../controllers/CursoController.controller"

const router = Router()
const cursosController = new CursoController

router.get('/', (req, res, next) => cursosController.getAll(req, res, next));
router.get('/:id', (req, res, next) => cursosController.getById(req, res, next));
router.post('/', (req, res, next) => cursosController.create(req, res, next));
router.put('/:id', (req, res, next) => cursosController.update(req, res, next));
router.delete('/:id', (req, res, next) => cursosController.delete(req, res, next));

export default router