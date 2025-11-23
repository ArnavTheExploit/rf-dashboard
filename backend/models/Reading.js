import mongoose from "mongoose";

const ReadingSchema = new mongoose.Schema({
  device_id: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  rf_dbm: { type: Number, required: true },
  timestamp: { type: Number, default: () => Date.now() }
});

export default mongoose.model("Reading", ReadingSchema);
