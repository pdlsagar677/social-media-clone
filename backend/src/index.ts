import express, { Application, Request, Response, NextFunction } from 'express';
import userRoute from './routes/user-route';
import postRoute from './routes/post-route';
import dotenv from 'dotenv';
import connectDB from './utils/db';

dotenv.config();

const app: Application = express();

const PORT: number = parseInt(process.env.PORT || '', 10);
if (isNaN(PORT)) {
  console.error('Invalid PORT in environment variables');
  process.exit(1);
}

app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/post', postRoute);

const startServer = async () => {
  const isDbConnected = await connectDB();
  
  if (!isDbConnected) {
    console.error('Failed to connect to MongoDB');
    process.exit(1);
  }

  console.log('MongoDB connected successfully');

  const server = app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  });

  process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
};

startServer();

app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
