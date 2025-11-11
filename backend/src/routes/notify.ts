import { Request, Response, Router } from "express";
import { sendNotification } from "../services/fcmService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { token, title, body, totalCalls, completedCalls, platform, screen, userId } = req.body;

  if (!token || !title || !body || totalCalls === undefined || completedCalls === undefined || !screen || !userId) {
    return res
      .status(400)
      .json({
        error: "token, title, body, totalcalls, completedcalls, screen, userid required",
      });
  }

  try {
    const response = await sendNotification({
      token,
      title,
      body,
      totalCalls,
      completedCalls,
      platform,
      screen,
      userId
    });
    res.json({ success: true, response });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
