import type { Request, Response } from 'express';
import {clearConversationNotifications, deleteNotificationById, getNotificationCount, getUnreadNotificationCount,
    getNotifications, markNotificationAsRead, markAllNotificationsAsRead} from '../services/notification.service.js';
import { ApiError } from '../utils/error.util.js';

export const fetchNotifications = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new ApiError(401, 'Unauthorized');
    }

    try {
        const notifications = await getNotifications(userId);
        const count = await getNotificationCount(userId);
        const unreadCount = await getUnreadNotificationCount(userId);
        res.json({
            success: true,
            data: {
                notifications,
                totalCount: count,
                unreadCount
            }
        });
    } 
    catch (error: any) {
        console.error('Error fetching notifications:', error);
        throw new ApiError(500, 'Failed to fetch notifications');
    }
};

export const markNotificationsRead = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new ApiError(401, 'Unauthorized');
    }
    try {
        const result = await markAllNotificationsAsRead(userId);
        res.json({
            success: true,
            message: 'All notifications marked as read',
            data: { 
                marked: result.marked,
                unreadCount: 0
            }
        });
    } 
    catch (error: any) {
        console.error('Error marking notifications as read:', error);
        throw new ApiError(500, 'Failed to mark notifications as read');
    }
};

export const markSingleNotificationRead = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const rawNotificationId = req.params.notificationId;
    const notificationId = typeof rawNotificationId === 'string' ? rawNotificationId : undefined;
    if (!userId) throw new ApiError(401, 'Unauthorized');
    if (!notificationId) throw new ApiError(400, 'Notification ID is required');

    try {
        const result = await markNotificationAsRead(userId, notificationId);
        if (!result.success) {
            throw new ApiError(404, result.error || 'Notification not found');
        }

        const unreadCount = await getUnreadNotificationCount(userId);
        res.json({
            success: true,
            message: result.alreadyRead ? 'Notification already read' : 'Notification marked as read',
            data: { 
                alreadyRead: result.alreadyRead || false,
                unreadCount
            }
        });
    } catch (error: any) {
        console.error('Error marking notification as read:', error);
        throw new ApiError(500, 'Failed to mark notification as read');
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const rawNotificationId = req.params.notificationId;
    const notificationId = typeof rawNotificationId === 'string' ? rawNotificationId : undefined;

    if (!userId) throw new ApiError(401, 'Unauthorized');
    if (!notificationId) throw new ApiError(400, 'Notification ID is required');
    try {
        const result = await deleteNotificationById(userId, notificationId);
        res.json({
            success: true,
            message: result.deleted ? 'Notification deleted' : 'Notification not found',
            data: {
                deleted: result.deleted,
                totalCount: result.count,
                unreadCount: result.unreadCount,
            }
        });
    } catch (error: any) {
        console.error('Error deleting notification:', error);
        throw new ApiError(500, 'Failed to delete notification');
    }
};

export const clearConversationNotificationItems = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const rawConversationId = req.params.conversationId;
    const conversationId = typeof rawConversationId === 'string' ? rawConversationId : undefined;

    if (!userId) throw new ApiError(401, 'Unauthorized');
    if (!conversationId) throw new ApiError(400, 'Conversation ID is required');
    try {
        const result = await clearConversationNotifications(userId, conversationId);
        res.json({
            success: true,
            message: 'Conversation notifications cleared',
            data: result
        });
    } catch (error: any) {
        console.error('Error clearing conversation notifications:', error);
        throw new ApiError(500, 'Failed to clear conversation notifications');
    }
};
