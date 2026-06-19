import { Router } from 'express';
import { createRequest, getRequests, reviewRequest } from '../controllers/requests.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getRequests);
router.post('/', authenticate, createRequest);
router.patch('/:id/review', authenticate, authorize(['FACULTY_COORDINATOR', 'STUDENT_COORDINATOR']), reviewRequest);

export default router;
