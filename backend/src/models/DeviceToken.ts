import mongoose, { Schema, Document } from "mongoose";

export interface IDeviceToken extends Document {
  token: string;
  platform: "android" | "ios";
  appVersion?: string;
  deviceModel?: string;
  userId?: string;
  createdAt: Date;
}

const DeviceTokenSchema: Schema = new Schema({
  token: { type: String, required: true, unique: true },
  platform: { type: String, required: true, enum: ["android", "ios"] },
  appVersion: String,
  deviceModel: String,
  userId: String,
  createdAt: { type: Date, default: Date.now },
});

const DeviceToken = mongoose.model<IDeviceToken>('DeviceToken', DeviceTokenSchema);

export default DeviceToken
