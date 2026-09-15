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
    client.on("message", (data, isBinary) => {
      if (target.readyState === WebSocket.OPEN) {
        target.send(data, { binary: isBinary });
      }
    });
  });

  target.on("message", (data, isBinary) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data, { binary: isBinary });
    }
  });

  target.on("error", () => {
    if (client.readyState === WebSocket.OPEN) {
      client.close();
    }
  });

  target.on("close", () => {
    if (client.readyState === WebSocket.OPEN) {
      client.close();
    }
  });

  client.on("error", () => {
    if (target.readyState === WebSocket.OPEN) {
      target.close();
    }
  });

  client.on("close", () => {
    if (target.readyState === WebSocket.OPEN) {
      target.close();
    }
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    relay: "active"
  });
});

export default server;