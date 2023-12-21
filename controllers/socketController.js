// socketController.js
const socketController = (io) => {
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      const { room } = socket.handshake.query;
      console.log('Joined Room:', room);
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
      const roomMembers = io.sockets.adapter.rooms.get(room);
      console.log(`Members of room ${room}:`, roomMembers);socket.on('codeUpdate', (data) => {
        console.log(`Received code update from client ${socket.id}:`, data.code);
        socket.broadcast.to(room).emit('codeUpdate', { code: data.code, sender: socket.id });
      });
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        const updatedRoomMembers = io.sockets.adapter.rooms.get(room);
        console.log(`Updated members of room ${room} after disconnect:`, updatedRoomMembers);
      });
    });
  };
  
  module.exports = socketController;
  