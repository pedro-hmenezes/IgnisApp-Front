import type { Request, Response } from 'express';
import { autenticarUsuario, criarUsuario, atualizarUsuario } from '../Services/UserService.js';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await autenticarUsuario(email, password);
  if (!result) return res.status(401).json({ message: 'Credenciais inválidas' });
  res.json(result);
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await criarUsuario(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao registrar usuário', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await atualizarUsuario(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar usuário', error });
  }
};