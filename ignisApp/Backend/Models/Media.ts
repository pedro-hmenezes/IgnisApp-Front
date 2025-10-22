export class Media {
    // Atributos
    private id: number;
    private fileType: string;
    private filePath: string;
    private capturedAt: Date;

    constructor(id: number, fileType: string, filePath: string, capturedAt: Date = new Date()) {
        this.id = id;
        this.fileType = fileType;
        this.filePath = filePath;
        this.capturedAt = capturedAt;
    }

    // Métodos
    public capture(): void {
        console.log(`Capturando mídia. Tipo: ${this.fileType}.`);
        // Lógica para iniciar a captura de foto/vídeo.
        // Em um ambiente real, este método poderia estar em um serviço ou controlador.
    }

    public compress(): void {
        console.log(`Comprimindo arquivo em: ${this.filePath}`);
        // Lógica de compressão do arquivo (redução de tamanho, etc.).
    }
    
    // Getters
    public getId(): number {
        return this.id;
    }

    public getFilePath(): string {
        return this.filePath;
    }
}