import { Location } from './Location';
import { Media } from './Media';
import { Signature } from './Signature';

export class Occurrence {
    // Atributos
    private id: number;
    private dateTime: Date;
    private type: string;
    private description: string;
    private status: string;
    
    // Relações (Adicionando a composição/agregação indicada pelo diagrama)
    private media: Media[] = []; // possui 
    private signatures: Signature[] = []; // coleta 
    private location?: Location; // contém  - Usamos '?' pois a relação é 0..1

    constructor(id: number, type: string, description: string, status: string, dateTime: Date = new Date()) {
        this.id = id;
        this.dateTime = dateTime;
        this.type = type;
        this.description = description;
        this.status = status;
    }

    // Eles permitem que outras classes acessem os atributos privados.
    public getId(): number {
        return this.id;
    }
    
    public getType(): string {
        return this.type;
    }
    
    public getStatus(): string {
        return this.status;
    }


    // Métodos de Ação
    public create(): void {
        console.log(`Nova ocorrência de tipo '${this.type}' criada com ID: ${this.id}.`);
        // Aqui entra a lógica para persistir a ocorrência no banco de dados.
    }

    public edit(newDescription: string, newStatus: string): void {
        this.description = newDescription;
        this.status = newStatus;
        console.log(`Ocorrência ${this.id} editada. Novo status: ${this.status}.`);
        // Lógica para atualizar no banco de dados.
    }

    public sync(): void {
        console.log(`Sincronizando a ocorrência ${this.id} com o servidor...`);
        // Lógica de sincronização.
    }

    // Métodos para gerenciar as relações (exemplo)
    public addMedia(m: Media): void {
        this.media.push(m);
    }
    
    public setLocation(l: Location): void {
        this.location = l;
    }
}