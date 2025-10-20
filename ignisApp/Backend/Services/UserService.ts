import { Usuario } from '../Models/User';

export class UsuarioService {
  private usuarios: Usuario[] = [
    new Usuario(1, 'Maria Augusta', 'CBM1234', 'Major', 'Quartel Central'),
    new Usuario(2, 'João Silva', 'CBM5678', 'Soldado', 'Posto 3')
  ];

  listar(): Usuario[] {
    return this.usuarios;
  }

  buscarPorMatricula(matricula: string): Usuario | undefined {
    return this.usuarios.find(u => u.matricula === matricula);
  }

  adicionar(usuario: Usuario): void {
    this.usuarios.push(usuario);
  }
}