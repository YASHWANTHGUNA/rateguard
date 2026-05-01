import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function RequestGraph() {
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/logs");

        const grouped = {};

        res.data.forEach((log) => {
          const time = new Date(log.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          if (!grouped[time]) {
            grouped[time] = {
              time: time,
              allowed: 0,
              blocked: 0,
            };
          }

          if (log.status === "allowed") {
            grouped[time].allowed++;
          } else {
            grouped[time].blocked++;
          }
        }); // ← forEach closes HERE ✅

        // Take last 20 points
        const chartData = Object.values(grouped)
                .sort((a, b) => {
                                      return new Date('1970/01/01 ' + a.time) 
                                       - new Date('1970/01/01 ' + b.time)
        })
                    .slice(-20)  

        setGraphData(chartData);
      } catch (err) {
        // ← try/catch OUTSIDE forEach ✅
        console.log(err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ textAlign: "center" }}>📈 Request Traffic Graph</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" stroke="white" tick={{ fontSize: 10 }} />

          <YAxis stroke="white" />

          <Tooltip
            contentStyle={{
              background: "#1a1a2e",
              border: "1px solid #52b788",
              borderRadius: "8px",
              color: "white",
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="allowed"
            stroke="#52b788"
            strokeWidth={2}
            dot={{ fill: "#52b788" }}
            name="Allowed ✅"
          />

          <Line
            type="monotone"
            dataKey="blocked"
            stroke="#e63946"
            strokeWidth={2}
            dot={{ fill: "#e63946" }}
            name="Blocked ❌"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RequestGraph;
