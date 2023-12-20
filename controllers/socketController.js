// socketController.js
const socketController = (io) => {
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
  
      const { room } = socket.handshake.query;
      console.log('Joined Room:', room);
  
      // Join the room using the sessionId as the roomName
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
  
      // Log all members of the room
      const roomMembers = io.sockets.adapter.rooms.get(room);
      console.log(`Members of room ${room}:`, roomMembers);
  
      // Listen for 'codeUpdate' events from clients
      socket.on('codeUpdate', (data) => {
        console.log(`Received code update from client ${socket.id}:`, data.code);
  
        // Broadcast the code update to all clients in the room (excluding the sender)
        socket.broadcast.to(room).emit('codeUpdate', { code: data.code, sender: socket.id });
      });
  
      // Handle disconnect events
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
  
        // Log updated members of the room after a disconnect
        const updatedRoomMembers = io.sockets.adapter.rooms.get(room);
        console.log(`Updated members of room ${room} after disconnect:`, updatedRoomMembers);
      });
    });
  };
  
  module.exports = socketController;
  