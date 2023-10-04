const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = []; //[lama]onlineUSers

const addUser = (userId, socketId) => {
  //[lama]addNewUser
  !users.some((user) => user.userId === userId) && //[lama]po username robi
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  //[lama]parametr username robi
  return users.find((user) => user.userId === userId);
};

const getUserForNotification = (username) => {
  return users.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  //when connect

  console.log("a user connected.");
  //take usetId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    } else {
      // Obsłuż sytuację, gdy użytkownik nie istnieje lub nie jest aktywny
      // Na przykład możesz zwrócić informację do nadawcy, że odbiorca jest niedostępny
      socket.emit("recipientUnavailable", receiverId);
    }
  });

  socket.on("sendNotification", ({ senderName, receiverId, type, link }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      type,
      link,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
