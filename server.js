import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Store for usernames and room data
const usernames = {};
const rooms = [
  { name: "globalChat", creator: "Anonymous" },
  { name: "chess", creator: "Anonymous" },
  { name: "javascript", creator: "Anonymous" }
];

// Handle socket connections
io.on("connection", (socket) => {
  console.log("New connection established:", socket.id);

  // Handle user creation
  socket.on("createUser", (name) => {
   
    socket.name = name;
    usernames[name] = name;
    socket.currentRoom = "globalChat";

    console.log(`User ${name} created successfully.`);

    // Automatically join the default rooms
    socket.join("globalChat")
    socket.emit("updateChat", "INFO", "You have joined global room");
});

   socket.on("sendMessage", (data) =>{
    io.sockets.to(socket.currentRoom).emit("updateChat",socket.name,  data)
   })

   socket.on("updateRoom",(room) =>{
    socket.broadcast.to(socket.currentRoom).emit("updateChat", "INFO", `${socket.name} left room`)

    socket.leave(socket.currentRoom)
    socket.currentRoom = room
    socket.join(room)
    socket.emit("updateChat", "INFO", `You have joined the room: ${room}`);
    socket.broadcast.to(socket.currentRoom).emit("updateChat", "INFO", `${socket.name} joined the room`)

   } )
   socket.on("createRoom", function (room) {
    if (room != null) {
      rooms.push({ name: room, creator: socket.name });
      io.sockets.emit("updateRooms", rooms, null);
    }
  });
  

 
  socket.on("disconnect", function () {
    console.log(`User ${socket.username} disconnected from server.`);
    delete usernames[socket.username];
    io.sockets.emit("updateUsers", usernames);
    socket.broadcast.emit(
      "updateChat",
      "INFO",
      socket.username + " has disconnected"
    );
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
