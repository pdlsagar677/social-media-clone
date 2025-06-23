import express, { Application, Request, Response, NextFunction } from 'express';
import userRoute from './routes/user-route';
import dotenv from 'dotenv';
import connectDB from './utils/db';

// Initialize environment variables
dotenv.config();

const app: Application = express();

// Validate and set port from environment
const PORT: number = parseInt(process.env.PORT || '', 10);
if (isNaN(PORT)) {
  console.error('Invalid PORT in environment variables');
  process.exit(1);
}

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoute);

// Database connection and server startup
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

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
};

startServer();

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;