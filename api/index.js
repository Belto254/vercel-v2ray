import { WebSocketServer } from "ws";

export default function handler(req, res) {
  res.status(200).json({
    status: "online",
    websocket: "ready"
  });
}