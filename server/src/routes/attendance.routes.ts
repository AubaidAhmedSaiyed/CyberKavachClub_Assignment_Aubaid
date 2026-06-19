import { Router } from 'express';
import { markAttendance, getAttendance } from '../controllers/attendance.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/event/:eventId', authenticate, getAttendance);
router.post('/', authenticate, authorize(['FACULTY_COORDINATOR', 'STUDENT_COORDINATOR', 'TECH_COORDINATOR']), markAttendance);

export default router;
