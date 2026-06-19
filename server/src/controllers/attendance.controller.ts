import { Request, Response } from 'express';
import { prisma } from '../utils/db';

export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, userId } = req.body;

    const existingRecord = await prisma.attendance.findFirst({
      where: { eventId, userId }
    });

    if (existingRecord) {
      if (!existingRecord.checkOutTime) {
        // Mark checkout
        const updated = await prisma.attendance.update({
          where: { id: existingRecord.id },
          data: { checkOutTime: new Date() }
        });
        res.status(200).json({ message: 'Check-out successful', attendance: updated });
        return;
      }
      res.status(400).json({ message: 'User already checked in and out.' });
      return;
    }

    // Mark checkin
    const newRecord = await prisma.attendance.create({
      data: {
        eventId,
        userId,
        status: 'PRESENT',
      }
    });

    res.status(201).json({ message: 'Check-in successful', attendance: newRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.params.eventId as string;
    const records = await prisma.attendance.findMany({
      where: { eventId },
      include: { user: { select: { firstName: true, lastName: true, studentId: true } } }
    });
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
