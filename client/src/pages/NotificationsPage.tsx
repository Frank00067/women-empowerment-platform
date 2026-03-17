import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: string;
  readAt?: string;
  link?: string;
}

const NotificationsPage = () => {
  const [items, setItems] = useState<Notification[]>([]);

  async function load() {
    const res = await axios.get("/api/notifications");
    setItems(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  const markAllRead = async () => {
    await axios.post("/api/notifications/mark-all-read");
    await load();
  };

  return (
    <div className="page">
      <h1>Notifications</h1>
      <p className="page-intro">
        Updates about job applications, new jobs, and course completion.
      </p>
      <button className="secondary-btn" onClick={markAllRead}>
        Mark all as read
      </button>
      <ul className="card-list" style={{ marginTop: "1rem" }}>
        {items.map((n) => (
          <li key={n.id} className="card">
            <h3>
              {!n.readAt ? "• " : ""}
              {n.title}
            </h3>
            <p>{n.body}</p>
            <p className="auth-footer">
              {new Date(n.createdAt).toLocaleString()}
            </p>
            {n.link && (
              <Link className="primary-btn ghost" to={n.link}>
                Open
              </Link>
            )}
          </li>
        ))}
      </ul>
      {!items.length && <p>No notifications yet.</p>}
    </div>
  );
};

export default NotificationsPage;

