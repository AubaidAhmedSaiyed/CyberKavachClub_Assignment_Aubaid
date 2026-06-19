import { Router } from 'express';
import { createTeam, getTeams } from '../controllers/teams.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getTeams);
router.post('/', authenticate, createTeam);

export default router;
