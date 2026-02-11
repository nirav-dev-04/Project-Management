import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Notifications({ reloadNotifications }) {
  const { notifications } = useSelector((state) => state.notifications);
  const navigate = useNavigate();

  const readNotification = async (notification) => {
    try {
      // mark as read
      // reload notifications
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h1 className="notifications-title text-primary font-semibold text-lg">
          Notifications
        </h1>
      </div>
      <div className="notifications-list space-y-3">
        {notifications?.length > 0 ? (
          notifications.map((notification) => (
            <div
              className="notification-card card p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary"
              key={notification._id}
              onClick={() => readNotification(notification)}
            >
              <div className="notification-content">
                <div className="notification-title text-primary font-medium mb-1">
                  {notification.title}
                </div>
                <div className="notification-description text-secondary text-sm mb-2">
                  {notification.description}
                </div>
                <div className="notification-date text-muted text-xs">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </div>
              </div>
              {!notification.read && (
                <div className="notification-unread w-2 h-2 bg-primary rounded-full ml-2"></div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-secondary">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
