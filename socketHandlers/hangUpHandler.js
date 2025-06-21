// Handler for when a user hangs up a call

function hangUpHandler(io, socket) {
  // When a user hangs up, notify the other participant
  socket.on('audio-call-hang-up', ({ otherUserId }) => {
    console.log(`[Backend] Hang up from ${socket.userId} to other user ${otherUserId}`);
    io.to(otherUserId).emit('audio-call-ended', {
      from: socket.userId,
    });
  });
}

module.exports = hangUpHandler; 