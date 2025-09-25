import { useAuthContext } from "../context/auth.context.jsx";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuthContext();

  // Simulated data — later pull from backend
  const [loginCount, setLoginCount] = useState(
    Number(localStorage.getItem("loginCount") || 0)
  );

  const [startDate] = useState(
    localStorage.getItem("startDate") || new Date().toString()
  );

  // Save startDate & increment login count
  useEffect(() => {
    if (!localStorage.getItem("startDate")) {
      localStorage.setItem("startDate", startDate);
    }
    const count = Number(localStorage.getItem("loginCount") || 0) + 1;
    localStorage.setItem("loginCount", count);
    setLoginCount(count);
  }, []);

  // Calculate streak
  const streak = (() => {
    const start = new Date(startDate);
    const today = new Date();
    const diff = Math.floor(
      (today.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );
    return diff + 1; // include today
  })();

  // Example goals progress (later fetch from backend)
  const goals = JSON.parse(localStorage.getItem("goals") || "[]");
  const goalsDone = goals.filter((g) => g.done).length;

  return (
    <div className="dashboard">
      <h2 className="title">Welcome back{user ? `, ${user.name}` : ""} 👋</h2>
      <div className="cards-grid">
        <div className="card stat-card">
          <p className="stat-label">Current Streak</p>
          <p className="stat-value">{streak} days</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Logins</p>
          <p className="stat-value">{loginCount}</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Goals Progress</p>
          <p className="stat-value">
            {goalsDone}/{goals.length} done
          </p>
        </div>
      </div>
    </div>
  );
}
