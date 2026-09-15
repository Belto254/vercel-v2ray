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
    client.on("message", (data) => {
      if (target.readyState === WebSocket.OPEN) {
        target.send(data);
      }
    });
  });

  target.on("message", (data) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });

  target.on("error", () => {
    client.close();
  });

  target.on("close", () => {
    client.close();
  });

  client.on("close", () => {
    target.close();
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    relay: "active"
  });
});

export default server;