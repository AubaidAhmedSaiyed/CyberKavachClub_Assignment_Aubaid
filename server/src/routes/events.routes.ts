import { Router } from 'express';
import { 
  createEvent, 
  getEvents, 
  publishEvent, 
  registerForEvent, 
  cancelRegistration, 
  getEventById,
  updateEvent,
  archiveEvent,
  exportEventData
} from '../controllers/events.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getEvents);
router.get('/:id', authenticate, getEventById);
router.post('/', authenticate, authorize(['FACULTY_COORDINATOR', 'STUDENT_COORDINATOR']), createEvent);
router.patch('/:id/publish', authenticate, authorize(['FACULTY_COORDINATOR']), publishEvent);
router.patch('/:id', authenticate, authorize(['FACULTY_COORDINATOR', 'STUDENT_COORDINATOR']), updateEvent);
router.delete('/:id', authenticate, authorize(['FACULTY_COORDINATOR']), archiveEvent);

// Registration & Waitlist
router.post('/:id/register', authenticate, registerForEvent);
router.delete('/:id/register', authenticate, cancelRegistration);

// Exports
router.get('/:id/export', authenticate, authorize(['FACULTY_COORDINATOR', 'STUDENT_COORDINATOR']), exportEventData);

export default router;
