
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
  console.log("INCOMING CLIENT CONNECTED");

  let closed = false;
  const pending = [];

  const target = new WebSocket(
    "ws://eu-2.hihu.net:80/jspuwqay",
    {
      perMessageDeflate: false
    }
  );

  target.on("open", () => {
    console.log("BACKEND CONNECTED SUCCESSFULLY");

    for (const msg of pending) {
      if (target.readyState === WebSocket.OPEN) {
        target.send(msg.data, {
          binary: msg.isBinary
        });
      }
    }

    pending.length = 0;
  });

  target.on("unexpected-response", (request, response) => {
    console.log(
      "BACKEND UNEXPECTED RESPONSE:",
      response.statusCode,
      response.statusMessage
    );
  });

  target.on("error", (err) => {
    console.log("BACKEND ERROR:", err.message);

    if (!closed && client.readyState === WebSocket.OPEN) {
      client.close();
    }
  });

  target.on("close", (code, reason) => {
    console.log(
      "BACKEND CLOSED:",
      code,
      reason.toString()
    );

    if (!closed && client.readyState === WebSocket.OPEN) {
      client.close();
    }
  });

  client.on("message", (data, isBinary) => {
    if (closed) return;

    if (target.readyState === WebSocket.OPEN) {
      target.send(data, { binary: isBinary });
    } else if (target.readyState === WebSocket.CONNECTING) {
      pending.push({ data, isBinary });
    }
  });

  target.on("message", (data, isBinary) => {
    if (!closed && client.readyState === WebSocket.OPEN) {
      client.send(data, { binary: isBinary });
    }
  });

  client.on("close", (code, reason) => {
    console.log(
      "CLIENT DISCONNECTED:",
      code,
      reason.toString()
    );

    closed = true;

    if (
      target.readyState === WebSocket.OPEN ||
      target.readyState === WebSocket.CONNECTING
    ) {
      target.close();
    }
  });

  client.on("error", (err) => {
    console.log("CLIENT ERROR:", err.message);
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    relay: "active",
    websocket: true,
    backend: "eu-2.hihu.net",
    protocol: "ws",
    port: 80
  });
});

export default server;
