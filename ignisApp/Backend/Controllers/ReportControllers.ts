import type { Request, Response } from 'express';
import { ReportService } from '../Services/ReportService';

export class ReportController {
  static async exportReport(req: Request, res: Response) {
    const { id, format, user, occurrences } = req.body;

    try {
      const filePath = await ReportService.export(id, format, user, occurrences);
      res.download(filePath);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao exportar relatório', error });
    }
  }
}
