"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
const ws_1 = require("ws");
const jwtHelpers_1 = require("../../../helpars/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const sendNotification_1 = require("../SendNotification/sendNotification");
const onlineUsers = new Set();
const userSockets = new Map();
function setupWebSocket(server) {
    const wss = new ws_1.WebSocketServer({ server });
    wss.on("connection", (ws) => {
        console.log("A user connected");
        ws.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedData = JSON.parse(data);
                switch (parsedData.event) {
                    case "authenticate": {
                        const token = parsedData.token;
                        if (!token) {
                            console.log("No token provided");
                            ws.close();
                            return;
                        }
                        const user = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.jwt_secret);
                        if (!user) {
                            console.log("Invalid token");
                            ws.close();
                            return;
                        }
                        const { id } = user;
                        const userData = yield prisma_1.default.user.findFirst({
                            where: {
                                id,
                            },
                        });
                        ws.userId = user === null || user === void 0 ? void 0 : user.id;
                        onlineUsers.add(userData === null || userData === void 0 ? void 0 : userData.id);
                        userSockets.set(userData === null || userData === void 0 ? void 0 : userData.id, ws);
                        broadcastToAll(wss, {
                            event: "userStatus",
                            data: { userId: userData === null || userData === void 0 ? void 0 : userData.id, isOnline: true },
                        });
                        break;
                    }
                    case "message": {
                        const { receiverId, message, images } = parsedData;
                        const receiver = yield prisma_1.default.user.findFirst({
                            where: { id: receiverId },
                            select: { id: true, role: true },
                        });
                        if (!receiver) {
                            console.log("Receiver not found");
                            return;
                        }
                        if (receiver.role === "CONCIERGE") {
                            const notificationData = {
                                userId: receiverId,
                                title: `New Message`,
                                body: message,
                            };
                            (0, sendNotification_1.sendNotification)(notificationData);
                        }
                        if (!ws.userId || !receiverId || !message) {
                            console.log("Invalid message payload");
                            return;
                        }
                        let room = yield prisma_1.default.room.findFirst({
                            where: {
                                OR: [
                                    { senderId: ws.userId, receiverId },
                                    { senderId: receiverId, receiverId: ws.userId },
                                ],
                            },
                        });
                        if (!room) {
                            room = yield prisma_1.default.room.create({
                                data: { senderId: ws.userId, receiverId },
                            });
                        }
                        const chat = yield prisma_1.default.chat.create({
                            data: {
                                senderId: ws.userId,
                                receiverId,
                                roomId: room.id,
                                message,
                                images: { set: images || [] },
                            },
                        });
                        const receiverSocket = userSockets.get(receiverId);
                        if (receiverSocket) {
                            receiverSocket.send(JSON.stringify({ event: "message", data: chat }));
                        }
                        ws.send(JSON.stringify({ event: "message", data: chat }));
                        break;
                    }
                    case "fetchChats": {
                        const { receiverId } = parsedData;
                        if (!ws.userId) {
                            console.log("User not authenticated");
                            return;
                        }
                        const room = yield prisma_1.default.room.findFirst({
                            where: {
                                OR: [
                                    { senderId: ws.userId, receiverId },
                                    { senderId: receiverId, receiverId: ws.userId },
                                ],
                            },
                        });
                        if (!room) {
                            ws.send(JSON.stringify({ event: "fetchChats", data: [] }));
                            return;
                        }
                        const chats = yield prisma_1.default.chat.findMany({
                            where: { roomId: room.id },
                            orderBy: { createdAt: "asc" },
                            select: {
                                id: true,
                                message: true,
                                images: true,
                                createdAt: true,
                                updatedAt: true,
                                receiverId: true,
                                senderId: true,
                                isRead: true,
                                receiver: {
                                    select: {
                                        Client: { select: { image: true } },
                                        Employ: { select: { image: true } },
                                        ServiceProvider: { select: { image: true } },
                                        Concierge: { select: { image: true } },
                                    },
                                },
                                sender: {
                                    select: {
                                        Client: { select: { image: true } },
                                        Employ: { select: { image: true } },
                                        ServiceProvider: { select: { image: true } },
                                        Concierge: { select: { image: true } },
                                    },
                                },
                            },
                        });
                        yield prisma_1.default.chat.updateMany({
                            where: { roomId: room.id, receiverId: ws.userId },
                            data: { isRead: true },
                        });
                        ws.send(JSON.stringify({
                            event: "fetchChats",
                            data: chats,
                            onlineUsers: onlineUsers.has(receiverId),
                        }));
                        break;
                    }
                    case "unReadMessages": {
                        const { receiverId } = parsedData;
                        if (!ws.userId || !receiverId) {
                            console.log("Invalid unread messages payload");
                            return;
                        }
                        const room = yield prisma_1.default.room.findFirst({
                            where: {
                                OR: [
                                    { senderId: ws.userId, receiverId },
                                    { senderId: receiverId, receiverId: ws.userId },
                                ],
                            },
                        });
                        if (!room) {
                            ws.send(JSON.stringify({ event: "noUnreadMessages", data: [] }));
                            return;
                        }
                        const unReadMessages = yield prisma_1.default.chat.findMany({
                            where: {
                                roomId: room.id,
                                isRead: false,
                                receiverId: ws.userId,
                            },
                        });
                        const unReadCount = unReadMessages.length;
                        ws.send(JSON.stringify({
                            event: "unReadMessages",
                            data: { messages: unReadMessages, count: unReadCount },
                        }));
                        break;
                    }
                    case "messageList": {
                        try {
                            // Fetch all rooms where the user is involved
                            const rooms = yield prisma_1.default.room.findMany({
                                where: {
                                    OR: [{ senderId: ws.userId }, { receiverId: ws.userId }],
                                },
                                include: {
                                    chat: {
                                        orderBy: {
                                            createdAt: "desc",
                                        },
                                        take: 1, // Fetch only the latest message for each room
                                    },
                                },
                            });
                            // Extract the relevant user IDs from the rooms
                            const userIds = rooms.map((room) => {
                                return room.senderId === ws.userId
                                    ? room.receiverId
                                    : room.senderId;
                            });
                            // Fetch user for the corresponding user IDs
                            const userInfos = yield prisma_1.default.user.findMany({
                                where: {
                                    id: {
                                        in: userIds,
                                    },
                                },
                                select: {
                                    id: true,
                                    Client: { select: { fullName: true, image: true } },
                                    Employ: { select: { fullName: true, image: true } },
                                    ServiceProvider: { select: { fullName: true, image: true } },
                                    Concierge: { select: { fullName: true, image: true } },
                                    //   profileImage: true,
                                    //   user: {
                                    //     select: {
                                    //       fullName: true,
                                    //     },
                                    //   },
                                },
                            });
                            // Combine user info with their last message
                            const userWithLastMessages = rooms.map((room) => {
                                const otherprofileId = room.senderId === ws.userId ? room.receiverId : room.senderId;
                                const userInfo = userInfos.find((userInfo) => userInfo.id === otherprofileId);
                                return {
                                    user: userInfo || null,
                                    lastMessage: room.chat[0] || null,
                                    onlineUsers: onlineUsers.has(userInfo === null || userInfo === void 0 ? void 0 : userInfo.id),
                                };
                            });
                            // Send the result back to the requesting client
                            ws.send(JSON.stringify({
                                event: "messageList",
                                data: userWithLastMessages,
                            }));
                        }
                        catch (error) {
                            console.error("Error fetching user list with last messages:", error);
                            ws.send(JSON.stringify({
                                event: "error",
                                message: "Failed to fetch users with last messages",
                            }));
                        }
                        break;
                    }
                    default:
                        console.log("Unknown event type:", parsedData.event);
                }
            }
            catch (error) {
                console.error("Error handling WebSocket message:", error);
            }
        }));
        ws.on("close", () => {
            if (ws.userId) {
                onlineUsers.delete(ws.userId);
                userSockets.delete(ws.userId);
                broadcastToAll(wss, {
                    event: "userStatus",
                    data: { userId: ws.userId, isOnline: false },
                });
            }
            console.log("User disconnected");
        });
    });
    return wss;
}
function broadcastToAll(wss, message) {
    wss.clients.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}
