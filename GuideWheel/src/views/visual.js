import React, { useState, useEffect, PureComponent } from "react";
import "./visual.css";
import Linegraph from "./linegraph";

export default function Visual() {
  const [date, setDate] = useState();
  const [time, setTime] = useState();

  useEffect(() => {
    console.log(date, time);
  }, [date, time]);

  return (
    <div className="container">
      <h3>Pleae input your date and time</h3>
      <div className="m-formInputGroup" style={{ display: "flex" }}>
        <input
          className="m-formInput"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          className="m-formInput"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div>
        <Linegraph inputDate={date} inputTime={time} />
      </div>
    </div>
  );
}
