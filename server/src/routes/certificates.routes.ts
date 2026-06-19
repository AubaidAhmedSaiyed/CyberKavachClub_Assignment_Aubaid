import { Router } from 'express';
import { generateCertificates } from '../controllers/certificates.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', authenticate, authorize(['FACULTY_COORDINATOR', 'TECH_COORDINATOR']), generateCertificates);

export default router;
