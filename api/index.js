import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

export default function handler(req, res) {
  if (req.headers.upgrade?.toLowerCase() === "websocket") {
    res.status(426).send("WebSocket upgrade required");
    return;
  }

  res.status(200).json({
    status: "online",
    websocket: "test-ready"
  });
}