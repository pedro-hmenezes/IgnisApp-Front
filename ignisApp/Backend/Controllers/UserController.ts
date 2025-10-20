import type { Request, Response } from 'express';
import { UsuarioService } from '../Services/UserService';

const usuarioService = new UsuarioService();

export const listarUsuarios = (req: Request, res: Response) => {
  res.json(usuarioService.listar());
};

export const buscarUsuario = (req: Request, res: Response) => {
  const { matricula } = req.params;
  const usuario = usuarioService.buscarPorMatricula(matricula);
  if (usuario) {
    res.json(usuario);
  } else {
    res.status(404).json({ erro: 'Usuário não encontrado' });
  }
};