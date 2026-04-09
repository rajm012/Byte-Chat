import { Router } from 'express';
import {clearConversationNotificationItems, deleteNotification, fetchNotifications, 
	markNotificationsRead, markSingleNotificationRead} from '../controllers/notification.controller.js';
import { clearAllNotifications } from '../services/notification.service.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Apply authentication middleware to all notification routes
router.use(authenticateToken);

// Get notifications and unread count
router.get('/', fetchNotifications);

// Mark all notifications as read
router.post('/read', markNotificationsRead);

// Mark single notification as read
router.post('/:notificationId/read', markSingleNotificationRead);

// Delete all notifications permanently
router.delete('/', clearAllNotifications);

// Delete one notification permanently
router.delete('/:notificationId', deleteNotification);

// Clear all notifications tied to a specific direct conversation
router.post('/conversation/:conversationId/clear', clearConversationNotificationItems);

export default router;
