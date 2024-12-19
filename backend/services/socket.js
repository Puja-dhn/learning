const { Server } = require("socket.io");
let connection = null;

class Socket {
  socket;

  constructor() {
    this.socket = null;
  }
  connect(httpServer) {
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.NODE_FRONTEND_URL || "http://localhost:4000",
        methods: ["GET", "POST"],
      },
    });
    io.on("connection", (socket) => {
      this.socket = socket;
    });
  }
  emit(event, data) {
    this.socket.emit(event, data);
  }
  static init(httpServer) {
    if (!connection) {
      connection = new Socket();
      connection.connect(httpServer);
    }
  }
  static getConnection() {
    if (connection) {
      return connection;
    }
  }
}
module.exports = {
  connect: Socket.init,
  connection: Socket.getConnection,
};
