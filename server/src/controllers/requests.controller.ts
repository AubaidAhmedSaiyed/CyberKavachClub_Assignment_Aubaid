import { Request, Response } from 'express';
import { prisma } from '../utils/db';
import { Role, RequestStatus } from '@prisma/client';

export const createRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, type, eventId } = req.body;
    const creatorId = (req as any).user.id;
    
    const request = await prisma.request.create({
      data: {
        title,
        description,
        type,
        eventId,
        creatorId,
        status: RequestStatus.PENDING,
      },
    });

    res.status(201).json({ message: 'Approval request submitted.', request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user.role;
    const userId = (req as any).user.id;

    let whereClause = {};
    if (userRole === Role.CLUB_MEMBER || userRole === Role.GUEST) {
      whereClause = { creatorId: userId };
    }

    const requests = await prisma.request.findMany({
      where: whereClause,
      include: {
        creator: { select: { firstName: true, lastName: true, email: true } },
        event: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const reviewRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, remarks } = req.body; // status: UNDER_REVIEW, APPROVED, REJECTED
    
    const request = await prisma.request.update({
      where: { id },
      data: { status, remarks },
    });

    res.status(200).json({ message: `Request status updated to ${status}`, request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
