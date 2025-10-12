import{ Router } from 'express'
import { PessoaController } from "../controllers/pessoa.controller";

const router = Router();
const pessoasController = new PessoaController();
console.log("🧭 Carregando pessoas.routes...");

router.get('/', (req, res, next) => pessoasController.getAll(req, res, next));
router.get('/:id', (req, res, next) => pessoasController.getById(req, res, next));
router.post('/', (req, res, next) => pessoasController.create(req, res, next));
router.put('/:id', (req, res, next) => pessoasController.update(req, res, next));
router.delete('/:id', (req, res, next) => pessoasController.delete(req, res, next));

console.log("✅ Rotas de pessoas registradas no Router:", router.stack.length);

export default router;