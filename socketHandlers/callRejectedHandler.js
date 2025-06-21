// Handler for when a call is rejected

function callRejectedHandler(io, socket) {
  // When a user rejects a call, notify the original caller
  socket.on('audio-call-rejected', ({ callerId }) => {
    console.log(`[Backend] Call rejected by ${socket.userId} to caller ${callerId}`);
    io.to(callerId).emit('audio-call-missed', {
      from: socket.userId,
    });
  });
}

module.exports = callRejectedHandler; 