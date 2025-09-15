// One-time script to add expiration dates to existing notifications
// Run this once after deploying the TTL changes
// node utils/cleanupExistingNotifications.js (to run this script)

import "../config/dbConnection.js";
import Notification from "../models/NotificationModel.js";

async function cleanupExistingNotifications() {
  try {
    console.log("Starting cleanup of existing notifications...");

    // Find all notifications without expiresAt field
    const notificationsWithoutExpiry = await Notification.find({
      expiresAt: { $exists: false },
    });

    console.log(
      `Found ${notificationsWithoutExpiry.length} notifications without expiration dates`
    );

    if (notificationsWithoutExpiry.length === 0) {
      console.log("No notifications need cleanup. All done!");
      return;
    }

    // Add expiration dates to existing notifications
    const bulkOps = notificationsWithoutExpiry.map((notification) => ({
      updateOne: {
        filter: { _id: notification._id },
        update: {
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      },
    }));

    const result = await Notification.bulkWrite(bulkOps);
    console.log(
      `Successfully updated ${result.modifiedCount} notifications with expiration dates`
    );

    // Also clean up very old notifications (older than 90 days)
    const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const deleteResult = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    console.log(
      `Deleted ${deleteResult.deletedCount} very old notifications (older than 90 days)`
    );
    console.log("Cleanup completed successfully!");
  } catch (error) {
    console.error("Error during notification cleanup:", error);
  } finally {
    process.exit(0);
  }
}

// Run the cleanup
cleanupExistingNotifications();
