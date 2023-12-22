// socketController.js
const socketController = (io) => {
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      const { room } = socket.handshake.query;
      console.log('Joined Room:', room);
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
      const roomMembers = io.sockets.adapter.rooms.get(room);
      console.log(`Members of room ${room}:`, roomMembers);
      socket.on('codeUpdate', (data) => {
        console.log(`Received code update from client ${socket.id}:`, data.code);
        socket.broadcast.to(room).emit('codeUpdate', { code: data.code, sender: socket.id });
      });
      
      socket.on('InitializeCode', () => {
        const otherSocketId = getOtherSocketId(socket, room);
        if (otherSocketId) {
          console.log(`Sending code request to ${otherSocketId}`);
        //socket.broadcast.to(room).emit('InitializeCode', { requester: socket.id });
          io.to(otherSocketId).emit('InitializeCode', { requester: socket.id });
        } else {
          console.log('No other socket in the room to request code from.');
        }
      });
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        const updatedRoomMembers = io.sockets.adapter.rooms.get(room);
        console.log(`Updated members of room ${room} after disconnect:`, updatedRoomMembers);
      });
      
        const getOtherSocketId = (currentSocket, room) => {
          const roomMembers = io.sockets.adapter.rooms.get(room);
          const socketIds = Array.from(roomMembers);

          console.log("inside "+socketIds);
        if (socketIds.length > 1) {
         
          console.log("otherSocketId " + socketIds[0]);
          return currentSocket!=socketIds[0]?socketIds[0]:socketIds[1];
        }
        return null;
      };
    });
  };


  module.exports = socketController;
  