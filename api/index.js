
import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({
  server,
  perMessageDeflate: false
});

wss.on("connection", (client) => {
  const pending = [];

  const target = new WebSocket(
    "wss://eu-2.hihu.net/jspuwqay",
    {
      perMessageDeflate: false,
      headers: {
        Host: "eu-2.hihu.net"
      }
    }
  );

  client.on("message", (data, isBinary) => {
    if (target.readyState === WebSocket.OPEN) {
      target.send(data, { binary: isBinary });
    } else {
      pending.push({ data, isBinary });
    }
  });

  target.on("open", () => {
    for (const msg of pending) {
      if (target.readyState === WebSocket.OPEN) {
        target.send(msg.data, {
          binary: msg.isBinary
        });
      }
    }

    pending.length = 0;
  });

  target.on("message", (data, isBinary) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data, {
        binary: isBinary
      });
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

  client.on("close", () => {
    if (
      target.readyState === WebSocket.OPEN ||
      target.readyState === WebSocket.CONNECTING
    ) {
      target.close();
    }
  });

  client.on("error", () => {
    if (
      target.readyState === WebSocket.OPEN ||
      target.readyState === WebSocket.CONNECTING
    ) {
      target.close();
    }
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    relay: "active",
    backend: "eu-2.hihu.net"
  });
});

export default server;
