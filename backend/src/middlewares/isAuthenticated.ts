import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the structure of the decoded token
interface DecodedToken {
  userId: string;
  [key: string]: any; // Allow for other properties
}

// Extend the Request interface to include the id property
declare module 'express' {
  interface Request {
    id?: string;
  }
}

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: 'User not authenticated',
        success: false
      });
    }

    const decode = await jwt.verify(
      token,
      process.env.SECRET_KEY || "mysecret"
    ) as DecodedToken;

    if (!decode || !decode.userId) {
      return res.status(401).json({
        message: 'Invalid token',
        success: false
      });
    }

    req.id = decode.userId;
    next();
  } catch (error: unknown) {
    console.error('Authentication error:', error instanceof Error ? error.message : error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: 'Invalid token',
        success: false
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: 'Token expired',
        success: false
      });
    }

    return res.status(500).json({
      message: 'Authentication failed',
      success: false
    });
  }
};

export default isAuthenticated;