import express from "express";
import Reading from "../models/Reading.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const reading = new Reading(req.body);
    await reading.save();
    res.json({ success: true, data: reading });
  } catch (error) {
    res.status(500).json({ error: "Failed to save reading" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const readings = await Reading.find().sort({ timestamp: -1 }).limit(500);
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch readings" });
  }
});

export default router;
