// const io = require("socket.io")(process.env.PORT || 3000, {
//   cors: {
//     origin: "http://127.0.0.1:5500/",
//     methods: ["GET", "POST"],
//   },
// });

const { Server } = require("socket.io");
const io = new Server(process.env.PORT || 3000, {
  cors: {
    origin: "https://ab16-2409-4043-4c96-2d7b-3173-cf0d-dbc7-a90.in.ngrok.io",
    methods: ["GET", "POST"],
  },
});

//Object to store the users
const users = {};

io.on("connection", (socket) => {
  //When user joins
  socket.on("new-user", (username) => {
    users[socket.id] = username;
    console.log("connected", username);
  });

  //Event for when any user sends a message
  socket.on(
    "send-event",
    (message_type, sender, message_text, lang_code, msg_recipient) => {
      message_type = "received-message";

      //Sending the message to other users
      if (msg_recipient === "") {
        //Send message to everyone
        socket.broadcast.emit(
          "receive-event",
          message_type,
          sender,
          message_text,
          lang_code
        );
      } else {
        if (Object.values(users).includes(msg_recipient)) {
          const recipient_id = Object.keys(users).find(
            (key) => users[key] === msg_recipient
          );

          socket
            .to(recipient_id)
            .emit(
              "receive-event",
              message_type,
              sender,
              message_text,
              lang_code
            );
        } else {
          socket.to(socket.id).emit("send-error", msg_recipient);
        }
      }
    }
  );

  //Event for when a user disconnects
  socket.on("disconnect", () => {
    delete users[socket.id];
    socket.disconnect();
  });
});
