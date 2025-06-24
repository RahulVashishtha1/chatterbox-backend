// WebRTC Call Signaling Handler for Socket.io (Audio & Video)

function callHandler(io, socket) {
    // When a user sends an offer to start a call (audio or video)
    socket.on('call-offer', ({ targetUserId, offer, callType }) => {
      console.log(`[Backend] ${callType} call offer received from ${socket.userId} to ${targetUserId}`);
      io.to(targetUserId).emit('call-offer', {
        fromUserId: socket.userId,
        offer,
        callType,
      });
    });
  
    // When a user sends an answer to an offer
    socket.on('call-answer', ({ targetUserId, answer, callType }) => {
      io.to(targetUserId).emit('call-answer', {
        fromUserId: socket.userId,
        answer,
        callType,
      });
    });
  
    // When a user sends an ICE candidate
    socket.on('call-ice-candidate', ({ targetUserId, candidate, callType }) => {
      io.to(targetUserId).emit('call-ice-candidate', {
        fromUserId: socket.userId,
        candidate,
        callType,
      });
    });
  }
  
  module.exports = callHandler;
  