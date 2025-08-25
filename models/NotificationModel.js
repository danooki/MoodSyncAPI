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
  },
  { timestamps: true }
);

// Optional: index for unread notifications
NotificationSchema.index({ user: 1, readAt: 1 });

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
