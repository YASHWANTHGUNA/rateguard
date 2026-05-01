import React, { useState } from "react";

function AlgorithmComparison() {
  const [fixedCount, setFixedCount] = useState(0);
  const [slidingCount, setSlidingCount] = useState(0);
  const [fixedBlocked, setFixedBlocked] = useState(false);
  const [slidingBlocked, setSlidingBlocked] = useState(false);
  const [slidingTimestamps, setSlidingTimestamps] = useState([]);

  const LIMIT = 5;
  const WINDOW = 10000; // 10 seconds for demo

  // Fixed Window Demo
  const sendFixed = () => {
    if (fixedBlocked) return;

    if (fixedCount >= LIMIT) {
      setFixedBlocked(true);
      setTimeout(() => {
        setFixedBlocked(false);
        setFixedCount(0);
      }, WINDOW);
      return;
    }
    setFixedCount((prev) => prev + 1);
  };

  // Sliding Window Demo
  const sendSliding = () => {
    const now = Date.now();
    const windowStart = now - WINDOW;
    const valid = slidingTimestamps.filter((t) => t > windowStart);

    if (valid.length >= LIMIT) {
      setSlidingBlocked(true);
      setTimeout(() => setSlidingBlocked(false), 2000);
      return;
    }

    const updated = [...valid, now];
    setSlidingTimestamps(updated);
    setSlidingCount(updated.length);
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ textAlign: "center" }}>⚔️ Algorithm Comparison</h2>
      <p style={{ textAlign: "center", color: "#aaa" }}>
        Limit: {LIMIT} requests / {WINDOW / 1000} seconds
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {/* Fixed Window */}
        <div
          style={{
            padding: "20px",
            background: "#1a1a2e",
            borderRadius: "10px",
            border: "1px solid #e63946",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#e63946" }}>Fixed Window Counter</h3>
          <p style={{ color: "#aaa", fontSize: "13px" }}>
            Resets at fixed time boundaries. Has boundary exploit vulnerability!
          </p>
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: fixedBlocked ? "#e63946" : "#52b788",
            }}
          >
            {fixedCount}/{LIMIT}
          </div>
          <button
            onClick={sendFixed}
            disabled={fixedBlocked}
            style={{
              padding: "10px 25px",
              background: fixedBlocked ? "#e63946" : "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: fixedBlocked ? "not-allowed" : "pointer",
              marginTop: "10px",
            }}
          >
            {fixedBlocked ? "❌ Blocked! Wait 10s" : "📤 Send Request"}
          </button>
          {fixedBlocked && (
            <p style={{ color: "#e63946", marginTop: "10px" }}>
              ⚠️ Entire window resets — predictable!
            </p>
          )}
        </div>

        {/* Sliding Window */}
        <div
          style={{
            padding: "20px",
            background: "#1a1a2e",
            borderRadius: "10px",
            border: "1px solid #52b788",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#52b788" }}>Sliding Window ⭐</h3>
          <p style={{ color: "#aaa", fontSize: "13px" }}>
            Always checks last N seconds. No boundary exploit possible!
          </p>
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: slidingBlocked ? "#e63946" : "#52b788",
            }}
          >
            {slidingCount}/{LIMIT}
          </div>
          <button
            onClick={sendSliding}
            disabled={slidingBlocked}
            style={{
              padding: "10px 25px",
              background: slidingBlocked ? "#e63946" : "#2d6a4f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: slidingBlocked ? "not-allowed" : "pointer",
              marginTop: "10px",
            }}
          >
            {slidingBlocked ? "❌ Blocked!" : "📤 Send Request"}
          </button>
          {slidingBlocked && (
            <p style={{ color: "#e63946", marginTop: "10px" }}>
              🛡️ Dynamic window — no exploit!
            </p>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "30px",
        }}
      >
        <thead>
          <tr style={{ background: "#333", color: "white" }}>
            <th style={{ padding: "10px" }}>Feature</th>
            <th style={{ padding: "10px", color: "#e63946" }}>Fixed Window</th>
            <th style={{ padding: "10px", color: "#52b788" }}>
              Sliding Window
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Accuracy", "❌ Low", "✅ High"],
            ["Boundary Exploit", "❌ Possible", "✅ Impossible"],
            ["Memory Usage", "✅ Low", "⚠️ Medium"],
            ["Complexity", "✅ Simple", "⚠️ Medium"],
            ["Production Use", "❌ Risky", "✅ Recommended"],
          ].map(([feature, fixed, sliding], i) => (
            <tr
              key={i}
              style={{
                borderBottom: "1px solid #333",
                textAlign: "center",
                background: i % 2 === 0 ? "#1a1a2e" : "#16213e",
              }}
            >
              <td style={{ padding: "10px", color: "white" }}>{feature}</td>
              <td style={{ padding: "10px" }}>{fixed}</td>
              <td style={{ padding: "10px" }}>{sliding}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AlgorithmComparison;
