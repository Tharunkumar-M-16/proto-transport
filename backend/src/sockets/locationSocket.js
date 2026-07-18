function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // user app calls this after picking a bus, to join that bus's "room"
    socket.on('trackBus', (busId) => {
      socket.join(busId);
      console.log(`${socket.id} tracking ${busId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

module.exports = initSocket;