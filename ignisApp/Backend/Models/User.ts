export class User {
    // Atributos
    private id: number;
    private name: string;
    private email: string;
    private role: string;
    private passwordHash: string;

    constructor(id: number, name: string, email: string, role: string, passwordHash: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.passwordHash = passwordHash;
    }

    // Getters (para acessar atributos privados, se necessário)
    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getRole(): string {
        return this.role;
    }

    // Métodos
    public async login(): Promise<boolean> {
        // Lógica de login
        console.log(`Usuário ${this.email} tentando fazer login...`);
        // Exemplo: return await AuthService.authenticate(this.email, password);
        return true; 
    }

    public async logout(): Promise<void> {
        // Lógica de logout
        console.log(`Usuário ${this.name} deslogado.`);
    }
}