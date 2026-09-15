import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.send("Vercel WebSocket connected");

  ws.on("message", (message) => {
    ws.send(`echo: ${message}`);
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    websocket: "active"
  });
});

export default server;