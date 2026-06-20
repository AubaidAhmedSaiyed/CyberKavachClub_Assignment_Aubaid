import { Request, Response } from 'express';
import { prisma } from '../utils/db';
import { Role } from '@prisma/client';
import { io } from '../index';

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, venue, date, time, teamSize, capacity, registrationDeadline, tags, rules, categories } = req.body;
    
    const newEvent = await prisma.event.create({
      data: {
        name,
        description,
        venue,
        date: new Date(date),
        time,
        teamSize: teamSize || 1,
        capacity: capacity || 100,
        registrationDeadline: new Date(registrationDeadline),
        tags: tags || [],
        rules: rules || [],
        categories: categories || [],
        isPublished: false,
      },
    });

    res.status(201).json({ message: 'Event created. Waiting for publishing approval.', event: newEvent });
    io.emit('SYSTEM_UPDATE');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user?.role;
    const whereClause = userRole === Role.GUEST || userRole === Role.CLUB_MEMBER 
      ? { isPublished: true, isArchived: false } 
      : { isArchived: false };

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { date: 'asc' },
      include: {
        _count: { select: { registrations: true, waitlists: true } }
      }
    });
    
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: { select: { registrations: true, waitlists: true } },
        registrations: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        waitlists: { orderBy: { position: 'asc' }, include: { user: { select: { firstName: true, lastName: true, email: true } } } }
      }
    });
    if (!event) { res.status(404).json({ message: 'Event not found' }); return; }
    res.status(200).json(event);
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
    io.emit('SYSTEM_UPDATE');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const event = await prisma.event.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json({ message: 'Event updated successfully', event });
    io.emit('SYSTEM_UPDATE');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const archiveEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.event.update({
      where: { id },
      data: { isArchived: true },
    });
    res.status(200).json({ message: 'Event archived successfully' });
    io.emit('SYSTEM_UPDATE');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.params.id as string;
    const userId = (req as any).user.id as string;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true, waitlists: true } } }
    });

    if (!event) { res.status(404).json({ message: 'Event not found' }); return; }
    if (new Date() > event.registrationDeadline) { res.status(400).json({ message: 'Registration closed' }); return; }

    // Check if already registered or waitlisted
    const existingReg = await prisma.eventRegistration.findFirst({ where: { eventId, userId, status: 'REGISTERED' } });
    if (existingReg) { res.status(400).json({ message: 'Already registered' }); return; }

    const existingWaitlist = await prisma.waitlist.findFirst({ where: { eventId, userId } });
    if (existingWaitlist) { res.status(400).json({ message: 'Already on waitlist' }); return; }

    if (event._count.registrations >= event.capacity) {
      // Add to waitlist
      const position = event._count.waitlists + 1;
      await prisma.waitlist.create({ data: { eventId, userId, position } });
      res.status(201).json({ message: 'Event is full. Added to waitlist.', waitlisted: true, position });
      io.emit('SYSTEM_UPDATE');
      return;
    }

    // Register
    await prisma.eventRegistration.create({ data: { eventId, userId, status: 'REGISTERED' } });
    
    // Add point for registering
    await prisma.pointHistory.create({ data: { userId, points: 5, reason: `Registered for ${event.name}` } });
    await prisma.user.update({ where: { id: userId }, data: { points: { increment: 5 } } });

    res.status(201).json({ message: 'Successfully registered for event', waitlisted: false });
    io.emit('SYSTEM_UPDATE');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.params.id as string;
    const userId = (req as any).user.id as string;

    // Check if waitlisted
    const waitlist = await prisma.waitlist.findFirst({ where: { eventId, userId } });
    if (waitlist) {
      await prisma.waitlist.delete({ where: { id: waitlist.id } });
      // Reorder waitlist positions
      await prisma.waitlist.updateMany({
        where: { eventId, position: { gt: waitlist.position } },
        data: { position: { decrement: 1 } }
      });
      res.status(200).json({ message: 'Removed from waitlist' });
      return;
    }

    const reg = await prisma.eventRegistration.findFirst({ where: { eventId, userId, status: 'REGISTERED' } });
    if (!reg) { res.status(400).json({ message: 'Not registered' }); return; }

    await prisma.eventRegistration.update({ where: { id: reg.id }, data: { status: 'CANCELLED' } });

    // Deduct points
    await prisma.pointHistory.create({ data: { userId, points: -5, reason: `Cancelled registration` } });
    await prisma.user.update({ where: { id: userId }, data: { points: { decrement: 5 } } });

    // Move first person from waitlist to registered
    const firstInQueue = await prisma.waitlist.findFirst({
      where: { eventId },
      orderBy: { position: 'asc' }
    });

    if (firstInQueue) {
      await prisma.eventRegistration.create({ data: { eventId, userId: firstInQueue.userId, status: 'REGISTERED' } });
      await prisma.waitlist.delete({ where: { id: firstInQueue.id } });
      await prisma.waitlist.updateMany({
        where: { eventId, position: { gt: firstInQueue.position } },
        data: { position: { decrement: 1 } }
      });
      // Notify promoted user via DB (Socket.io omitted here for brevity)
      await prisma.notification.create({
        data: {
          userId: firstInQueue.userId,
          title: 'Waitlist Promoted!',
          message: 'You have been promoted from the waitlist to registered for the event.',
          type: 'SYSTEM'
        }
      });
    }

    res.status(200).json({ message: 'Registration cancelled' });
    io.emit('SYSTEM_UPDATE');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const exportEventData = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: { include: { user: true } },
        waitlists: { include: { user: true } },
        attendances: { include: { user: true } }
      }
    });

    if (!event) { res.status(404).json({ message: 'Event not found' }); return; }

    const format = req.query.format as string || 'json';

    if (format === 'csv') {
      const header = 'Type,Name,Email,Student ID,Timestamp\n';
      const regs = event.registrations.map(r => `Registered,${r.user.firstName} ${r.user.lastName},${r.user.email},${r.user.studentId || ''},${r.createdAt}`).join('\n');
      const waits = event.waitlists.map(w => `Waitlisted,${w.user.firstName} ${w.user.lastName},${w.user.email},${w.user.studentId || ''},${w.createdAt}`).join('\n');
      const atts = event.attendances.map(a => `Attended,${a.user.firstName} ${a.user.lastName},${a.user.email},${a.user.studentId || ''},${a.checkInTime}`).join('\n');
      
      const csv = header + [regs, waits, atts].filter(x => x).join('\n');
      res.header('Content-Type', 'text/csv');
      res.attachment(`${event.name}-report.csv`);
      res.send(csv);
      return;
    }

    // Default to JSON
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
