import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { getAdminAnalytics, getMemberAnalytics } from '../controllers/analytics.controller';
import { Role } from '@prisma/client';

const router = express.Router();

router.get('/admin', authenticate, authorize([Role.FACULTY_COORDINATOR, Role.STUDENT_COORDINATOR, Role.TECH_COORDINATOR]), getAdminAnalytics);
router.get('/member', authenticate, getMemberAnalytics);

export default router;
