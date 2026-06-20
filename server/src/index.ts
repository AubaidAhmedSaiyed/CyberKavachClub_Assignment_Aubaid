import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import eventsRoutes from './routes/events.routes';
import requestsRoutes from './routes/requests.routes';
import teamsRoutes from './routes/teams.routes';
import attendanceRoutes from './routes/attendance.routes';
import certificatesRoutes from './routes/certificates.routes';
import analyticsRoutes from './routes/analytics.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'CyberKavach API is running' });
});

import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Pass io to request handlers if needed (optional: export it)
export { io };

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
