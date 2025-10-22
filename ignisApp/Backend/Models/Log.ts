export class Log {
    // Atributos
    private id: number;
    private dateTime: Date;
    private action: string;
    private details: string;

    constructor(id: number, action: string, details: string, dateTime: Date = new Date()) {
        this.id = id;
        this.dateTime = dateTime;
        this.action = action;
        this.details = details;
    }

    // Métodos
    public register(): void {
        console.log(`[LOG - ${this.dateTime.toISOString()}] Ação: ${this.action}. Detalhes: ${this.details}`);
        // Lógica para persistir este registro de log no banco de dados.
    }
    
    // Getters
    public getId(): number {
        return this.id;
    }

    public getDateTime(): Date {
        return this.dateTime;
    }
}