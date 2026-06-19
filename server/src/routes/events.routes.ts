import { Router } from 'express';
import { createEvent, getEvents, publishEvent } from '../controllers/events.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getEvents);
router.post('/', authenticate, authorize(['FACULTY_COORDINATOR', 'STUDENT_COORDINATOR']), createEvent);
router.patch('/:id/publish', authenticate, authorize(['FACULTY_COORDINATOR']), publishEvent);

export default router;
