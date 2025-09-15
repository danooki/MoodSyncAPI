import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const NotificationSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      index: true,
    },
    data: {
      type: Schema.Types.Mixed, // flexible field to store any extra info (inviteId, circleId, etc.)
    },
    readAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index
    },
  },
  { timestamps: true }
);

// Optional: index for unread notifications
NotificationSchema.index({ user: 1, readAt: 1 });

// TTL index: automatically delete notifications after 7 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
