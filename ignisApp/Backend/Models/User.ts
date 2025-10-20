export type Patente = 'Soldado' | 'Cabo' | 'Sargento' | 'Tenente' | 'Capitão' | 'Major' | 'Coronel';

export class Usuario {
  constructor(
    public id: number,
    public nome: string,
    public matricula: string,
    public patente: Patente,
    public unidade: string,
    public ativo: boolean = true
  ) {}

  getIdentificacao(): string {
    return `${this.patente} ${this.nome} (${this.matricula})`;
  }

  desativar(): void {
    this.ativo = false;
  }
}