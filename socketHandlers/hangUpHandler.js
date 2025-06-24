// Handler for when a user hangs up a call

function hangUpHandler(io, socket) {
  // When a user hangs up, notify both participants
  socket.on('call-hang-up', ({ otherUserId, callType }) => {
    console.log(`[Backend] Hang up from ${socket.userId} to other user ${otherUserId} (type: ${callType})`);
    // Notify both users
    console.log(`[Backend] Emitting 'call-ended' to otherUserId: ${otherUserId}`);
    io.to(otherUserId).emit('call-ended', {
      from: socket.userId,
      callType,
    });
    console.log(`[Backend] Emitting 'call-ended' to self: ${socket.userId}`);
    io.to(socket.userId).emit('call-ended', {
      from: socket.userId,
      callType,
    });
  });
}

module.exports = hangUpHandler; 