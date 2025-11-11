import { Router, Request, Response } from "express";
import DeviceToken from "../models/DeviceToken";

const router = Router();

// Register token
router.post("/", async (req: Request, res: Response) => {
  const { token, platform, deviceModel, appVersion, userId } = req.body;

  console.log('token in backend', req.body)

  if (!token || !platform) {
    return res.status(400).json({ error: "token and platform required" });
  }

  try {

    const platformNormalized = platform.toLowerCase();

    await DeviceToken.findOneAndUpdate(
      { token },
      { platform: platformNormalized, appVersion, deviceModel, userId, createdAt: new Date() },
      { upsert: true, new: true }
    )
    console.log(`📱 Registered ${platform} device token`);
    res.json({ success: true, message: "Token registered successfully" });

  } catch (err) {
    console.error("Error saving token:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Get all tokens (for testing / broadcast)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const tokens = await DeviceToken.find()
    res.json({ success: true, tokens });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
