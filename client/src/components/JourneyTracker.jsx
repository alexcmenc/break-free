import { useState } from "react";
import SobrietyClock from "./SobrietyClock.jsx";
import Milestones from "./Milestones.jsx";

export default function JourneyTracker() {
  const [startDate, setStartDate] = useState(localStorage.getItem("sobrietyStart"));

  const handleStart = () => {
    const today = new Date().toISOString();
    localStorage.setItem("sobrietyStart", today);
    setStartDate(today);
  };

  const handleReset = () => {
    localStorage.removeItem("sobrietyStart");
    setStartDate(null);
  };

  return (
    <div className="journey">
      {!startDate ? (
        <div className="card start-box">
          <h3 className="card-title">Begin Your Journey</h3>
          <button className="btn btn-primary" onClick={handleStart}>
            Start My Clock
          </button>
        </div>
      ) : (
        <>
          <SobrietyClock />
          <Milestones />
          <button className="btn btn-danger" onClick={handleReset}>
            Reset Clock
          </button>
        </>
      )}
    </div>
  );
}
