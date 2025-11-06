const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

import notifyRoutes from "./routes/notify";
import registerRoutes from "./routes/register";
import accessTokenRoutes from './routes/tokenRoute'

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/api/notify", notifyRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/access-token", accessTokenRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err: any) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT

app.get("/", (req : any, res : any) => {
  res.send("Notification IOS")
})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
