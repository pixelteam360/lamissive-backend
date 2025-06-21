"use strict";
// import { Server } from "http";
// import { WebSocket, WebSocketServer } from "ws";
// import { jwtHelpers } from "../../../helpars/jwtHelpers";
// import config from "../../../config";
// import prisma from "../../../shared/prisma";
// interface ExtendedWebSocket extends WebSocket {
//   profileId?: string;
//   userId?: string;
// }
// const onlineUsers = new Set<string>();
// const userSockets = new Map<string, ExtendedWebSocket>();
// export function setupWebSocket(server: Server) {
//   const wss = new WebSocketServer({ server });
//   wss.on("connection", (ws: ExtendedWebSocket) => {
//     console.log("A user connected");
//     ws.on("message", async (data: string) => {
//       try {
//         const parsedData = JSON.parse(data);
//         switch (parsedData.event) {
//           case "authenticate": {
//             const token = parsedData.token;
//             if (!token) {
//               console.log("No token provided");
//               ws.close();
//               return;
//             }
//             const user = jwtHelpers.verifyToken(
//               token,
//               config.jwt.jwt_secret as string
//             );
//             if (!user) {
//               console.log("Invalid token");
//               ws.close();
//               return;
//             }
//             const { id } = user;
//             const userProfile = await prisma.userProfile.findFirst({
//               where: {
//                 userId: id,
//               },
//             });
//             ws.profileId = userProfile?.id;
//             onlineUsers.add(userProfile?.id!);
//             userSockets.set(userProfile?.id as string, ws);
//             broadcastToAll(wss, {
//               event: "userStatus",
//               data: { profileId: userProfile?.id, isOnline: true },
//             });
//             break;
//           }
//           case "message": {
//             const { receiverId, message, images } = parsedData;
//             if (!ws.profileId || !receiverId || !message) {
//               console.log("Invalid message payload");
//               return;
//             }
//             let room = await prisma.room.findFirst({
//               where: {
//                 OR: [
//                   { senderId: ws.profileId, receiverId },
//                   { senderId: receiverId, receiverId: ws.profileId },
//                 ],
//               },
//             });
//             if (!room) {
//               room = await prisma.room.create({
//                 data: { senderId: ws.profileId, receiverId },
//               });
//             }
//             const chat = await prisma.chat.create({
//               data: {
//                 senderId: ws.profileId,
//                 receiverId,
//                 roomId: room.id,
//                 message,
//                 images: { set: images || [] },
//               },
//             });
//             const receiverSocket = userSockets.get(receiverId);
//             if (receiverSocket) {
//               receiverSocket.send(
//                 JSON.stringify({ event: "message", data: chat })
//               );
//             }
//             ws.send(JSON.stringify({ event: "message", data: chat }));
//             break;
//           }
//           case "fetchChats": {
//             const { receiverId } = parsedData;
//             if (!ws.profileId) {
//               console.log("User not authenticated");
//               return;
//             }
//             const room = await prisma.room.findFirst({
//               where: {
//                 OR: [
//                   { senderId: ws.profileId, receiverId },
//                   { senderId: receiverId, receiverId: ws.profileId },
//                 ],
//               },
//             });
//             if (!room) {
//               ws.send(JSON.stringify({ event: "fetchChats", data: []}));
//               return;
//             }
//             const chats = await prisma.chat.findMany({
//               where: { roomId: room.id },
//               orderBy: { createdAt: "asc" },
//             });
//             await prisma.chat.updateMany({
//               where: { roomId: room.id, receiverId: ws.profileId },
//               data: { isRead: true },
//             });
//             ws.send(
//               JSON.stringify({
//                 event: "fetchChats",
//                 data: chats,
//                 onlineUsers: onlineUsers.has(receiverId),
//               })
//             );
//             break;
//           }
//           case "unReadMessages": {
//             const { receiverId } = parsedData;
//             if (!ws.profileId || !receiverId) {
//               console.log("Invalid unread messages payload");
//               return;
//             }
//             const room = await prisma.room.findFirst({
//               where: {
//                 OR: [
//                   { senderId: ws.profileId, receiverId },
//                   { senderId: receiverId, receiverId: ws.profileId },
//                 ],
//               },
//             });
//             if (!room) {
//               ws.send(JSON.stringify({ event: "noUnreadMessages", data: [] }));
//               return;
//             }
//             const unReadMessages = await prisma.chat.findMany({
//               where: {
//                 roomId: room.id,
//                 isRead: false,
//                 receiverId: ws.profileId,
//               },
//             });
//             const unReadCount = unReadMessages.length;
//             ws.send(
//               JSON.stringify({
//                 event: "unReadMessages",
//                 data: { messages: unReadMessages, count: unReadCount },
//               })
//             );
//             break;
//           }
//           case "messageList": {
//             try {
//               // Fetch all rooms where the user is involved
//               const rooms = await prisma.room.findMany({
//                 where: {
//                   OR: [
//                     { senderId: ws.profileId },
//                     { receiverId: ws.profileId },
//                   ],
//                 },
//                 include: {
//                   chat: {
//                     orderBy: {
//                       createdAt: "desc",
//                     },
//                     take: 1, // Fetch only the latest message for each room
//                   },
//                 },
//               });
//               // Extract the relevant user IDs from the rooms
//               const profileIds = rooms.map((room) => {
//                 return room.senderId === ws.profileId
//                   ? room.receiverId
//                   : room.senderId;
//               });
//               // Fetch user profiles for the corresponding user IDs
//               const userInfos = await prisma.userProfile.findMany({
//                 where: {
//                   id: {
//                     in: profileIds,
//                   },
//                 },
//                 select: {
//                   profileImage: true,
//                   id: true,
//                   user: {
//                     select: {
//                       fullName: true,
//                     },
//                   },
//                 },
//               });
//               // Combine user info with their last message
//               const userWithLastMessages = rooms.map((room) => {
//                 const otherprofileId =
//                   room.senderId === ws.profileId
//                     ? room.receiverId
//                     : room.senderId;
//                 const userInfo = userInfos.find(
//                   (userInfo) => userInfo.id === otherprofileId
//                 );
//                 return {
//                   user: userInfo?.user || null,
//                   lastMessage: room.chat[0] || null,
//                   onlineUsers: onlineUsers.has(userInfo?.id as string),
//                 };
//               });
//               // Send the result back to the requesting client
//               ws.send(
//                 JSON.stringify({
//                   event: "messageList",
//                   data: userWithLastMessages,
//                 })
//               );
//             } catch (error) {
//               console.error(
//                 "Error fetching user list with last messages:",
//                 error
//               );
//               ws.send(
//                 JSON.stringify({
//                   event: "error",
//                   message: "Failed to fetch users with last messages",
//                 })
//               );
//             }
//             break;
//           }
//           default:
//             console.log("Unknown event type:", parsedData.event);
//         }
//       } catch (error) {
//         console.error("Error handling WebSocket message:", error);
//       }
//     });
//     ws.on("close", () => {
//       if (ws.profileId) {
//         onlineUsers.delete(ws.profileId);
//         userSockets.delete(ws.profileId);
//         broadcastToAll(wss, {
//           event: "userStatus",
//           data: { profileId: ws.profileId, isOnline: false },
//         });
//       }
//       console.log("User disconnected");
//     });
//   });
//   return wss;
// }
// function broadcastToAll(wss: WebSocketServer, message: object) {
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(message));
//     }
//   });
// }
