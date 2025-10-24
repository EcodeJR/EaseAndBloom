const Notification = require('../models/Notification');
const Admin = require('../models/Admin');

/**
 * Create a notification for all active admins
 * @param {Object} notificationData - Notification data
 * @param {string} notificationData.title - Notification title
 * @param {string} notificationData.message - Notification message
 * @param {string} notificationData.type - Notification type (story, system, blog, admin, waitlist)
 * @param {string} notificationData.priority - Priority level (low, medium, high, urgent)
 * @param {string} notificationData.relatedId - Related document ID
 * @param {string} notificationData.relatedType - Related document type
 * @param {string} notificationData.actionUrl - Action URL
 * @param {Object} notificationData.metadata - Additional metadata
 */
const createNotificationForAllAdmins = async (notificationData) => {
  try {
    const admins = await Admin.find({ isActive: true }).select('_id');
    
    const notifications = admins.map(admin => ({
      ...notificationData,
      recipient: admin._id
    }));

    await Notification.insertMany(notifications);
    console.log(`Created notifications for ${notifications.length} admins`);
  } catch (error) {
    console.error('Error creating notifications for all admins:', error);
  }
};

/**
 * Create a notification for a specific admin
 * @param {string} adminId - Admin ID
 * @param {Object} notificationData - Notification data
 */
const createNotificationForAdmin = async (adminId, notificationData) => {
  try {
    const notification = new Notification({
      ...notificationData,
      recipient: adminId
    });

    await notification.save();
    console.log(`Created notification for admin ${adminId}`);
    return notification;
  } catch (error) {
    console.error('Error creating notification for admin:', error);
  }
};

/**
 * Create story submission notification
 * @param {Object} story - Story document
 */
const createStorySubmissionNotification = async (story) => {
  await createNotificationForAllAdmins({
    title: 'New Story Submission',
    message: `"${story.title}" has been submitted for review`,
    type: 'story',
    priority: 'medium',
    relatedId: story._id,
    relatedType: 'story',
    actionUrl: '/admin/stories',
    metadata: {
      submitterName: story.submitterName,
      category: story.category
    }
  });
};

/**
 * Create story approval notification
 * @param {Object} story - Story document
 */
const createStoryApprovalNotification = async (story) => {
  if (story.submitterEmail) {
    // This would typically be sent to the submitter, but for now we'll notify admins
    await createNotificationForAllAdmins({
      title: 'Story Approved',
      message: `"${story.title}" has been approved and published`,
      type: 'story',
      priority: 'low',
      relatedId: story._id,
      relatedType: 'story',
      actionUrl: '/admin/stories',
      metadata: {
        submitterName: story.submitterName,
        category: story.category
      }
    });
  }
};

/**
 * Create system notification
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} priority - Priority level
 */
const createSystemNotification = async (title, message, priority = 'medium') => {
  await createNotificationForAllAdmins({
    title,
    message,
    type: 'system',
    priority,
    actionUrl: null,
    metadata: {}
  });
};

module.exports = {
  createNotificationForAllAdmins,
  createNotificationForAdmin,
  createStorySubmissionNotification,
  createStoryApprovalNotification,
  createSystemNotification
};
