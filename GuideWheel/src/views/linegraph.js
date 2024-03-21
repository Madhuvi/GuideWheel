import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import pumpData from "../output";

export default function Linegraph(props) {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    setReportData([]);
    getReport();
  }, [props.inputDate, props.inputTime]);

  function calculateAveragePsumForDay(dayTimestamp) {
    const dayStart = dayTimestamp - 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const relevantData = pumpData.filter(
      (entry) => entry.fromts >= dayStart && entry.tots <= dayTimestamp
    );
    const psumValues = relevantData.map((entry) => entry.metrics.Psum.avgvalue);
    const top10PsumValues = psumValues.sort((a, b) => b - a).slice(0, 10);
    const averagePsum =
      top10PsumValues.reduce((sum, value) => sum + value, 0) /
      top10PsumValues.length;
    return averagePsum;
  }

  // Function to determine the state based on Psum value
  function determineState(Psum, operatingLoad) {
    if (Psum === 0) {
      // return "Off";
      return 0;
    } else if (Psum < 0.1) {
      // return "On - unloaded";
      return 1;
    } else if (Psum < 0.2 * operatingLoad) {
      // return "On - idle";
      return 2;
    } else {
      // return "On - loaded";
      return 3;
    }
  }

  function getReport() {
    const givenTimeStamp = new Date(
      props.inputDate + " " + props.inputTime
    ).getTime();
    console.log(givenTimeStamp);
    const operatingLoad = calculateAveragePsumForDay(givenTimeStamp);

    let dateObject = new Date(props.inputDate + " " + props.inputTime);
    let timestamp = dateObject.getTime();

    let finalData = [];

    for (let i = 0; i < 24; i++) {
      finalData.push({ name: i, state: 0 });
    }

    pumpData.forEach((entry) => {
      const fromDate = new Date(parseInt(entry.fromts));
      let tempData = {};

      if (
        parseInt(entry.fromts) >= timestamp &&
        fromDate.getMinutes() == 0 &&
        parseInt(entry.fromts) <= timestamp + 60 * 60 * 1000 * 24
      ) {
        const state = determineState(
          entry.metrics.Psum.avgvalue,
          operatingLoad
        );
        let hour = fromDate.getHours() - new Date(timestamp).getHours(); // props.inputDate.getHours();

        tempData["name"] = hour;
        console.log(state, " **");
        tempData["state"] = state;
        finalData[hour] = tempData;
        // finalData.push(tempData);

        // finalData.sort((a, b) => a.name - b.name);
      }
    });

    setReportData(finalData);
  }

  function formatYAxis(value) {
    console.log(value);
    if (value == 0) return "Off";
    if (value == 1) return "On-unloaded";
    if (value == 2) return "On-idle";
    return "On-loaded";
  }

  return (
    <>
      <h2>Machine State</h2>
      <LineChart
        width={700}
        height={500}
        data={reportData}
        style={{ margin: "50px auto" }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis ticks={[0, 1, 2, 3]} tickFormatter={formatYAxis} width={90} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="state"
          // stroke="#8884d8"
          // activeDot={{ r: 8 }}
        />
      </LineChart>{" "}
    </>
  );
}
