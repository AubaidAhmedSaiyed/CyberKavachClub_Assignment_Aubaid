import { Request, Response } from 'express';
import { prisma } from '../utils/db';
import { Role } from '@prisma/client';

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, venue, date, time, teamSize, registrationDeadline, tags, rules } = req.body;
    
    // Create the event
    const newEvent = await prisma.event.create({
      data: {
        name,
        description,
        venue,
        date: new Date(date),
        time,
        teamSize: teamSize || 1,
        registrationDeadline: new Date(registrationDeadline),
        tags: tags || [],
        rules: rules || [],
        isPublished: false, // Must be approved to publish
      },
    });

    res.status(201).json({ message: 'Event created. Waiting for publishing approval.', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user?.role;
    // Public can only see published events
    const whereClause = userRole === Role.GUEST || userRole === Role.CLUB_MEMBER 
      ? { isPublished: true } 
      : {};

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { date: 'asc' },
    });
    
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const publishEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const event = await prisma.event.update({
      where: { id },
      data: { isPublished: true },
    });
    res.status(200).json({ message: 'Event published successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
