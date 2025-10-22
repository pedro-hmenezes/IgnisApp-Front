import { Occurrence } from './Occurrence';
import { User } from './User';

export class Report {
    // Atributos
    private id: number;
    private generatedAt: Date;
    private format: string; // Ex: 'PDF', 'CSV', 'JSON'
    
    // Relações
    private user: User; // O usuário que solicitou o relatório (consulta)
    private occurrences: Occurrence[]; // As ocorrências que o relatório irá agregar

    constructor(id: number, format: string, user: User, occurrences: Occurrence[], generatedAt: Date = new Date()) {
        this.id = id;
        this.format = format;
        this.user = user;
        this.occurrences = occurrences;
        this.generatedAt = generatedAt;
    }

    // Métodos
    public generate(): string {
        console.log(`Gerando relatório ID: ${this.id} para o usuário ${this.user.getName()}.`);
        
        let content = `Relatório de Ocorrências - Gerado em: ${this.generatedAt.toLocaleString()}\n`;
        content += `Formato: ${this.format}\n`;
        content += `Total de Ocorrências: ${this.occurrences.length}\n\n`;
        
        // Simulação de geração de conteúdo
        this.occurrences.forEach(occ => {
            // content += occ.toString(); // Se Occurrence tivesse um método toString()
            content += ` - Ocorrência ID: ${occ.getId()}, Tipo: ${occ.getType()}, Status: ${occ.getStatus()}\n`;
        });
        
        return content;
    }

    public export(): void {
        const reportContent = this.generate();
        console.log(`Exportando o relatório ID: ${this.id} no formato ${this.format}...`);
        // Lógica real de exportação para um arquivo (PDF, CSV, etc.).
        // console.log("--- Conteúdo do Relatório ---");
        // console.log(reportContent);
    }
    
    // Getters
    public getId(): number {
        return this.id;
    }

    public getGeneratedAt(): Date {
        return this.generatedAt;
    }
}