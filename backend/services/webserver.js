const https = require("https");
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const socket = require("./socket");
const { Server } = require("socket.io");

const bodyParser = require("body-parser");

const routes = require("../routes");
const webServerConfig = require("../configs/webserver.js");

const sslEnabled = process.env.NODE_SSL === "enabled";
let hostname = process.env.NODE_DOMAIN_URL;

let httpsServer;

const httpsOptions = {
  cert: sslEnabled ? fs.readFileSync(process.env.NODE_SSL_CERT_URL) : "",
  key: sslEnabled ? fs.readFileSync(process.env.NODE_SSL_KEY) : "",
};

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();

    //VA Closure
    app.disable("x-powered-by");
    app.set("etag", false);
    //

    httpsServer = sslEnabled
      ? https.createServer(httpsOptions, app)
      : http.createServer(app);

    // Combines logging info from request and response

    app.use(morgan("combined"));

    // body parser

    app.use(
      bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
      })
    );
    app.use(bodyParser.json({ limit: "50mb" }));

    // cors

    app.use(cors());

    // routes

    app.get("/", (req, res) => {
      res.end("Welcome to InSHE app Web API");
    });

    app.use("/api", routes);

    // Socket

    const io = new Server(httpsServer, {
      path: "/ns-websocket",
      // cors: {
      //   origin: process.env.NODE_FRONTEND_URL || `https://${hostname}:4000`,
      //   methods: ["GET", "POST"],
      // },
    });

    io.on("connection", (socket) => {
      console.log(`User connected ${socket.id}`);
      socket.on("message", (data) => {
        console.log(`New message from ${socket.id}: ${data}`);
        io.emit("message", `${socket.id}: ${data}`);
      });
      socket.on("BROADCAST", (data) => {
        console.log(`New BROADCAST message from ${socket.id}: ${data}`);
        io.emit("BROADCAST_RELAY", `${socket.id}: ${data}`);
      });
      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });

    app.set("socketio", io);

    app.use(express.static("static"));

    // custom 404

    app.use((req, res, next) => {
      res.status(404).send("Sorry! The requested Resource is not found");
    });

    // http startup

    httpsServer.listen(webServerConfig.port, hostname, (err) => {
      if (err) {
        reject(err);
        return;
      }

      console.log(
        `Web server listening on http://${hostname}:${webServerConfig.port}`
      );

      resolve();
    });
  });
}

function close() {
  return new Promise((resolve, reject) => {
    httpsServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      logger.log("info", "Web Server Shutdown");
      resolve();
    });
  });
}

module.exports.close = close;

module.exports.initialize = initialize;
