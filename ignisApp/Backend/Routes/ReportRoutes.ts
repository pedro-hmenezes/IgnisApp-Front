import { Router } from 'express';
import { ReportController } from '../Controllers/ReportControllers';

const router = Router();

router.post('/report/export', ReportController.exportReport);

export default router;
