export default function handler(req, res) {
  res.status(200).json({
    status: "online",
    message: "Vercel V2Ray relay test"
  });
}