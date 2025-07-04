import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { Tnotification } from "../SendNotification/notificationInterface";
import { sendNotification } from "../SendNotification/sendNotification";

interface ExtendedWebSocket extends WebSocket {
  userId?: string;
}

const onlineUsers = new Set<string>();
const userSockets = new Map<string, ExtendedWebSocket>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: ExtendedWebSocket) => {
    console.log("A user connected");

    ws.on("message", async (data: string) => {
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

            const user = jwtHelpers.verifyToken(
              token,
              config.jwt.jwt_secret as string
            );

            if (!user) {
              console.log("Invalid token");
              ws.close();
              return;
            }

            const { id } = user;

            const userData = await prisma.user.findFirst({
              where: {
                id,
              },
            });

            ws.userId = user?.id;

            onlineUsers.add(userData?.id!);
            userSockets.set(userData?.id as string, ws);

            broadcastToAll(wss, {
              event: "userStatus",
              data: { userId: userData?.id, isOnline: true },
            });
            break;
          }

          case "message": {
            const { receiverId, message, images } = parsedData;

            const receiver = await prisma.user.findFirst({
              where: { id: receiverId },
              select: { id: true, role: true },
            });

            if (!receiver) {
              console.log("Receiver not found");
              return;
            }

            if (receiver.role === "CONCIERGE") {
              const notificationData: Tnotification = {
                userId: receiverId,
                title: `New Message`,
                body: message,
              };

              sendNotification(notificationData);
            }

            if (!ws.userId || !receiverId || !message) {
              console.log("Invalid message payload");
              return;
            }

            let room = await prisma.room.findFirst({
              where: {
                OR: [
                  { senderId: ws.userId, receiverId },
                  { senderId: receiverId, receiverId: ws.userId },
                ],
              },
            });

            if (!room) {
              room = await prisma.room.create({
                data: { senderId: ws.userId, receiverId },
              });
            }

            const chat = await prisma.chat.create({
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
              receiverSocket.send(
                JSON.stringify({ event: "message", data: chat })
              );
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

            const room = await prisma.room.findFirst({
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

            const chats = await prisma.chat.findMany({
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

            await prisma.chat.updateMany({
              where: { roomId: room.id, receiverId: ws.userId },
              data: { isRead: true },
            });

            ws.send(
              JSON.stringify({
                event: "fetchChats",
                data: chats,
                onlineUsers: onlineUsers.has(receiverId),
              })
            );
            break;
          }

          case "unReadMessages": {
            const { receiverId } = parsedData;
            if (!ws.userId || !receiverId) {
              console.log("Invalid unread messages payload");
              return;
            }

            const room = await prisma.room.findFirst({
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

            const unReadMessages = await prisma.chat.findMany({
              where: {
                roomId: room.id,
                isRead: false,
                receiverId: ws.userId,
              },
            });

            const unReadCount = unReadMessages.length;

            ws.send(
              JSON.stringify({
                event: "unReadMessages",
                data: { messages: unReadMessages, count: unReadCount },
              })
            );
            break;
          }

          case "messageList": {
            try {
              // Fetch all rooms where the user is involved
              const rooms = await prisma.room.findMany({
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
              const userInfos = await prisma.user.findMany({
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
                const otherprofileId =
                  room.senderId === ws.userId ? room.receiverId : room.senderId;

                const userInfo = userInfos.find(
                  (userInfo) => userInfo.id === otherprofileId
                );

                return {
                  user: userInfo || null,
                  lastMessage: room.chat[0] || null,
                  onlineUsers: onlineUsers.has(userInfo?.id as string),
                };
              });

              // Send the result back to the requesting client
              ws.send(
                JSON.stringify({
                  event: "messageList",
                  data: userWithLastMessages,
                })
              );
            } catch (error) {
              console.error(
                "Error fetching user list with last messages:",
                error
              );
              ws.send(
                JSON.stringify({
                  event: "error",
                  message: "Failed to fetch users with last messages",
                })
              );
            }
            break;
          }

          default:
            console.log("Unknown event type:", parsedData.event);
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    });

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

function broadcastToAll(wss: WebSocketServer, message: object) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
