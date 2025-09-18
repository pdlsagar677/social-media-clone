import { Server, Socket } from 'socket.io';

interface UserSocketMap {
  [userId: string]: string;
}

const userSocketMap: UserSocketMap = {};
let io: Server | null = null;

/**
 * Initialize Socket.IO with the HTTP server
 */
export const initSocket = (server: any): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;

    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`${userId} connected`);
    }

    io?.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
      if (userId) {
        delete userSocketMap[userId];
        console.log(`${userId} disconnected`);
      }
      io?.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });

  return io;
};

/**
 * Get Socket.IO instance
 */
export const getIO = (): Server | null => io;

/**
 * Get socket ID of a specific user
 */
export const getReceiverSocketId = (receiverId: string): string | undefined =>
  userSocketMap[receiverId];
