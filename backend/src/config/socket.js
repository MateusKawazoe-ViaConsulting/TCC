const { Server } = require('socket.io');
const io = new Server({cors: {
        origin: '*',
    }});

const socketArray = []

var Socket = {
    emit_user: function (event, data) {
        const result = socketArray.map((element, index) => {
            if (element.user === data.user)
                return index
        });

        if (result[0] !== null && result[0] > -1) {
            socketArray[result[0]].socket.emit(event, data);
        }
    }
};

io.on("connection", function (socket) {
  socketArray.push({
      socket: socket,
      user: socket.handshake.query.user
  });
  console.log("A user connected: ");
  console.log(socket.handshake.query.user);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    console.log(socket.handshake.query.user);
    const result = socketArray.map((element, index) => {
      if (element.user === socket.handshake.query.user)
          return index
    });
    socketArray.splice(result[0], 1);
  });
});

module.exports = {
	Socket,
	io
};
