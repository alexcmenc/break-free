import { useEffect, useState } from "react";

export default function SobrietyClock() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const startDate = localStorage.getItem("sobrietyStart") || new Date().toISOString();

  useEffect(() => {
    localStorage.setItem("sobrietyStart", startDate);

    const tick = () => {
      const now = new Date();
      const start = new Date(startDate);
      const diff = now - start;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTime({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="card clock">
      <h3 className="card-title">Sobriety Clock</h3>
      <p className="clock-time">
        {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
      </p>
    </div>
  );
}
