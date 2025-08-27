// Lists all pending invitations for the user.
export async function listMyInvites(userId) {
  return await CircleInvite.find({ toUser: userId, status: "pending" })
    .populate("circle", "circleName")
    .lean();
}

// Lists all unread notifications for the user.
export async function listUnreadNotifications(userId) {
  return await Notification.find({ user: userId, readAt: { $exists: false } })
    .sort({ createdAt: -1 })
    .lean();
}

// Marks a notification as read.
export async function markNotificationRead(notificationId, userId) {
  const n = await Notification.findOne({ _id: notificationId, user: userId });
  if (!n) {
    const err = new Error("Notification not found");
    err.status = 404;
    throw err;
  }
  if (!n.readAt) {
    n.readAt = new Date();
    await n.save();
  }
  return { ok: true };
}
