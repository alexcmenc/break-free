import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../context/useAuthContext.js";
import api from "../utils/api.js";

function daysBetween(startDate) {
  if (!startDate) return null;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return null;
  const today = new Date();
  const diff = Math.floor(
    (today.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  return diff >= 0 ? diff + 1 : null;
}

export default function Dashboard() {
  const { user } = useAuthContext();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchLogs() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/logs?limit=100");
        if (ignore) return;
        setLogs(Array.isArray(response.data) ? response.data : response.data || []);
      } catch (error) {
        console.error("Failed to load logs", error);
        if (!ignore) setError("Could not load your recent logs yet.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchLogs();
    return () => {
      ignore = true;
    };
  }, []);

  const streak = useMemo(() => daysBetween(user?.quitDate), [user?.quitDate]);

  const stats = useMemo(() => {
    if (!logs.length) {
      return {
        total: 0,
        slips: 0,
        monthTotal: 0,
        slipFreeRate: 100,
        lastMood: null,
        recent: [],
      };
    }

    const now = Date.now();
    const monthMs = 30 * 24 * 60 * 60 * 1000;

    let slips = 0;
    let monthTotal = 0;
    let lastMood = null;

    logs.forEach((log) => {
      if (log.slip) slips += 1;
      if (now - new Date(log.at).getTime() <= monthMs) monthTotal += 1;
      if (!lastMood && log.mood) lastMood = log.mood;
    });

    const total = logs.length;
    const slipFreeRate = total
      ? Math.round(((total - slips) / total) * 100)
      : 100;

    return {
      total,
      slips,
      monthTotal,
      slipFreeRate,
      lastMood,
      recent: logs.slice(0, 4),
    };
  }, [logs]);

  return (
    <div className="dashboard glass-panel">
      <h2 className="title">Welcome back{user ? `, ${user.name}` : ""} 👋</h2>
      <p className="subtitle">
        Here’s a snapshot of how your journey is taking shape right now.
      </p>

      <div className="cards-grid">
        <div className="card stat-card">
          <p className="stat-label">Current streak</p>
          <p className="stat-value">
            {typeof streak === "number" ? `${streak} days` : "Set your quit date"}
          </p>
          {user?.quitDate && (
            <p className="stat-hint">
              Started {new Date(user.quitDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="card stat-card">
          <p className="stat-label">Logs this month</p>
          <p className="stat-value">
            {loading ? "…" : stats.monthTotal || (stats.total ? "0" : "Let’s begin")}
          </p>
          <p className="stat-hint">
            {stats.total
              ? `${stats.total} total reflections recorded`
              : "Jot a quick note today to start spotting patterns"}
          </p>
        </div>

        <div className="card stat-card">
          <p className="stat-label">Slip-free ratio</p>
          <p className="stat-value">
            {loading ? "…" : `${stats.slipFreeRate}%`}
          </p>
          <p className="stat-hint">
            {stats.slips
              ? `${stats.slips} slip${stats.slips === 1 ? "" : "s"} logged`
              : "You’ve stayed consistent—keep going!"}
          </p>
        </div>
      </div>

      <div className="card recent-logs">
        <div className="recent-header">
          <h3 className="card-title">Recent reflections</h3>
          {stats.lastMood && <span className="badge">Last mood: {stats.lastMood}</span>}
        </div>

        {error && <p className="error">{error}</p>}

        {!loading && !stats.recent.length && !error && (
          <p className="muted">
            No logs just yet. Capture today’s thoughts to build your timeline.
          </p>
        )}

        {loading && <p className="muted">Loading your latest entries…</p>}

        {!loading && stats.recent.length > 0 && (
          <ul className="recent-list">
            {stats.recent.map((log) => (
              <li key={log._id} className="recent-item">
                <div>
                  <p className="recent-date">
                    {new Date(log.at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  {log.note && <p className="recent-note">{log.note}</p>}
                </div>
                <div className="recent-tags">
                  {log.mood && <span className="tag">{log.mood}</span>}
                  {log.slip && <span className="tag tag-slip">Slip</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
