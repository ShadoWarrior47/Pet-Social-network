import React, { useContext } from "react";
import { CurrentUserContext } from "../CurrentUserContext";
// import "./Notification.css"; // Assume you have some styles defined

function Notifications({ notifications }) {
  const { currentUser } = useContext(CurrentUserContext);

  if (!currentUser) {
    return <div>Please log in to view notifications.</div>;
  }

  if (notifications.length === 0) {
    return <div className="notification-list">No new notifications.</div>;
  }

  return (
    <div className="notification-list">
      <h3>Your Notifications</h3>
      {notifications.map(notif => (
        <div key={notif.id} className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}>
          <p>{notif.content}</p>
          {!notif.is_read && <button onClick={() => markAsRead(notif.id)}>Mark as Read</button>}
        </div>
      ))}
    </div>
  );
}

export default Notifications;