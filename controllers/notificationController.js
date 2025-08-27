import {
  listUnreadNotifications,
  markNotificationRead,
} from "../services/notificationService.js";

// GET unread notifications for the user
export async function listUnreadNotificationsController(req, res, next) {
  try {
    const notifications = await listUnreadNotifications(req.userId);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
}

// POST mark a notification as read
export async function markNotificationReadController(req, res, next) {
  try {
    const { notificationId } = req.params;
    const result = await markNotificationRead(notificationId, req.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
