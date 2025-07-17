import { Server, Socket } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: (process.env.SOCKET_URL as string).split(','),
        methods: ['GET', 'POST']
    }
});
// Define types for our socket map
interface UserSocketMap {
    [userId: string]: string; // Maps user ID (string) to socket ID (string)
}

const userSocketMap: UserSocketMap = {};

export const getReceiverSocketId = (receiverId: string): string | undefined => {
    return userSocketMap[receiverId];
};

io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;
    
    if (userId && typeof userId === 'string') {
        userSocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        if (userId && typeof userId === 'string') {
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, server, io };