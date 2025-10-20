import { Router } from 'express';
import { listarUsuarios, buscarUsuario } from '../Controllers/UserController';

const router = Router();

router.get('/', listarUsuarios);
router.get('/:matricula', buscarUsuario);

export default router;