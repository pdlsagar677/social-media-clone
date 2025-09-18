import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';

import connectDB from './utils/db';
import userRoute from './routes/user-route';
import postRoute from './routes/post-route';
import messageRoute from './routes/message-route';
import { initSocket } from './socket/socket';

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 5000;

// ---------- HTTP Server ----------
const server = http.createServer(app);

// ---------- Initialize Socket.IO ----------
initSocket(server);

// ---------- Middlewares ----------
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(cookieParser());
app.use(express.json());

// ---------- API Routes ----------
app.use('/api/users', userRoute);
app.use('/api/post', postRoute);
app.use('/api/message', messageRoute);

// ---------- 404 Handler ----------
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ---------- Error Handler ----------
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ---------- Start Server ----------
const startServer = async () => {
  const isDbConnected = await connectDB();
  if (!isDbConnected) {
    console.error('Failed to connect to MongoDB');
    process.exit(1);
  }
  console.log('MongoDB connected successfully');

  server.listen(PORT, () => {
    console.log(`Server (API + Socket.IO) running on http://localhost:${PORT}`);
  });

  process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
};

startServer();

export { app, server };
