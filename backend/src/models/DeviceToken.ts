import mongoose, { Schema, Document } from "mongoose";

export interface IDeviceToken extends Document {
  token: string;
  createdAt: Date;
}

const DeviceTokenSchema: Schema = new Schema({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const DeviceToken = mongoose.model<IDeviceToken>('DeviceToken', DeviceTokenSchema);

export default DeviceToken
