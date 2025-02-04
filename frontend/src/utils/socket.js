import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export const joinNotifications = (userId) => {
  socket.emit("join", userId);
};

export const listenForNotifications = (callback) => {
  socket.on("new_notification", (notification) => {
    callback(notification);
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;
