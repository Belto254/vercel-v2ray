import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (client) => {
  const target = new WebSocket(
    "wss://indo2.vpnjantit.com/vpnjantit"
  );

  target.on("open", () => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("BACKEND_CONNECTED");
    }
  });

  target.on("error", (err) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("BACKEND_ERROR");
      client.close();
    }
  });

  target.on("close", () => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("BACKEND_CLOSED");
    }
    client.close();
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    relay: "diagnostic"
  });
});

export default server;