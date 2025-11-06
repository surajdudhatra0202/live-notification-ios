// src/routes/tokenRoute.ts
import { google } from "googleapis";
import path from "path";
import { Router } from "express";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const keyPath = path.join(__dirname, "../config/firebase-key.json");
    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });

    const token = await auth.getAccessToken();
    res.json({ accessToken: token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
