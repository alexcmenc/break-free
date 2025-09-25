import { useEffect, useState } from "react";

export default function Milestones() {
  const milestones = [1, 7, 30, 90, 180, 365];
  const startDate = localStorage.getItem("sobrietyStart") || new Date().toISOString();
  const [days, setDays] = useState(0);

  useEffect(() => {
    const start = new Date(startDate);
    const now = new Date();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    setDays(diff);
  }, [startDate]);

  return (
    <div className="card milestones">
      <h3 className="card-title">Milestones</h3>
      <ul className="milestone-list">
        {milestones.map((m) => (
          <li key={m} className={days >= m ? "achieved" : "upcoming"}>
            {m} days {days >= m ? "✅" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
