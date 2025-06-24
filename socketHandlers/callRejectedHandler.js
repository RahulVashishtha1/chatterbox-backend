// Handler for when a call is rejected

function callRejectedHandler(io, socket) {
  // When a user rejects a call, notify the original caller
  socket.on('call-rejected', ({ callerId, callType }) => {
    console.log(`[Backend] Call rejected by ${socket.userId} to caller ${callerId} (type: ${callType})`);
    io.to(callerId).emit('call-missed', {
      from: socket.userId,
      callType,
    });
  });
}

module.exports = callRejectedHandler; 