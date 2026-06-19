import { Request, Response } from 'express';
import { prisma } from '../utils/db';
import crypto from 'crypto';

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, members } = req.body; // members is array of userIds
    const creatorId = (req as any).user.id;
    
    // Auto-generate Team ID
    const teamId = `TEAM-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const newTeam = await prisma.team.create({
      data: {
        name,
        teamId,
        members: {
          create: [
            { userId: creatorId, isLeader: true },
            // Only add valid members (filtering out potentially empty strings)
            ...members.filter((id: string) => id.length === 24).map((id: string) => ({ userId: id, isLeader: false }))
          ]
        }
      },
      include: { members: true }
    });

    res.status(201).json({ message: 'Team created successfully', team: newTeam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: {
          include: { user: { select: { firstName: true, lastName: true, email: true } } }
        }
      }
    });
    res.status(200).json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
