import { Request, Response } from 'express';
import { prisma } from '../utils/db';

export const getAdminAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();
    const activeEvents = await prisma.event.count({ where: { isArchived: false } });
    const totalRegistrations = await prisma.eventRegistration.count();
    const totalWaitlisted = await prisma.waitlist.count();

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true }
    });

    const pendingEvents = await prisma.event.findMany({
      where: { isPublished: false, isArchived: false },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    const recentRegistrations = await prisma.eventRegistration.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        event: { select: { name: true, date: true } }
      }
    });

    res.status(200).json({
      totalUsers,
      activeEvents,
      totalRegistrations,
      totalWaitlisted,
      recentUsers,
      pendingEvents,
      recentRegistrations
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

export const getMemberAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true }
    });

    const myRegistrationsCount = await prisma.eventRegistration.count({ where: { userId } });
    const myWaitlistsCount = await prisma.waitlist.count({ where: { userId } });
    const myAttendancesCount = await prisma.attendance.count({ where: { userId } });
    const myCertificatesCount = await prisma.userBadge.count({ where: { userId } }); 

    const myRegisteredEvents = await prisma.eventRegistration.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const upcomingEvents = await prisma.event.findMany({
      where: { isPublished: true, isArchived: false, date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      take: 5
    });

    res.status(200).json({
      points: user?.points || 0,
      myRegistrations: myRegistrationsCount,
      myWaitlists: myWaitlistsCount,
      myAttendances: myAttendancesCount,
      myCertificates: myCertificatesCount,
      myRegisteredEvents,
      upcomingEvents
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Server error fetching member analytics' });
  }
};
