// WebRTC Audio Call Signaling Handler for Socket.io

function audioCallHandler(io, socket) {
  // When a user sends an offer to start a call
  socket.on('audio-call-offer', ({ targetUserId, offer }) => {
    console.log(`[Backend] Audio call offer received from ${socket.userId} to ${targetUserId}`);
    io.to(targetUserId).emit('audio-call-offer', {
      fromUserId: socket.userId,
      offer,
    });
  });

  // When a user sends an answer to an offer
  socket.on('audio-call-answer', ({ targetUserId, answer }) => {
    io.to(targetUserId).emit('audio-call-answer', {
      fromUserId: socket.userId,
      answer,
    });
  });

  // When a user sends an ICE candidate
  socket.on('audio-call-ice-candidate', ({ targetUserId, candidate }) => {
    io.to(targetUserId).emit('audio-call-ice-candidate', {
      fromUserId: socket.userId,
      candidate,
    });
  });
}

module.exports = audioCallHandler; 