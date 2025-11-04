import { Router, Request, Response } from "express";
import DeviceToken from "../models/DeviceToken";

const router = Router();

// Register token
router.post("/", async (req: Request, res: Response) => {
  const { token } = req.body;

  console.log('token in backend', token )

  if (!token) {
    return res.status(400).json({ error: "token required" });
  }

  try {
    let existing = await DeviceToken.findOne({ token });
    if (!existing) {
      await DeviceToken.create({ token });
    }
    res.json({ success: true, message: "Token registered successfully" });
  } catch (err) {
    console.error("Error saving token:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Get all tokens (for testing / broadcast)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const tokens = await DeviceToken.find().select("token -_id");
    res.json({ success: true, tokens });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
