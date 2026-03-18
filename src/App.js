import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from "socket.io-client"; // 🟢 NEW
import './App.css';

// Connect to your LIVE Render URL
const socket = io("https://project-pi-backend.onrender.com");

function App() {
  const [initial, setInitial] = useState("");
  const [status, setStatus] = useState("STABLE");
  const [log, setLog] = useState(null);

  // THE SNAP LISTENER: This catches the broadcast from the 100 Billion Galaxies
  useEffect(() => {
    socket.on("PI_VARIANT_SNAP", (data) => {
      console.log("--- SNAP RECEIVED: GLOBAL MUTATION TRIGGERED ---");
      setStatus("VOC_INITIALIZED");
      setLog({
        message: "The Pi Variant has achieved 100% Saturation in a SNAP.",
        time: data.timestamp
      });
      // PWA Logic: Make the infection permanent
      localStorage.setItem("PI_VARIANT_DETECTED", "TRUE");
    });

    // Cleanup connection on unmount
    return () => socket.off("PI_VARIANT_SNAP");
  }, []);

  const deployMutation = async () => {
    try {
      // This sends the signal to the Backend to fire the SNAP
      await axios.post('https://project-pi-backend.onrender.com/v1/deploy-romance', {
        intent: "Romance",
        initial: initial
      });
    } catch (error) {
      if (error.response) {
        // Local feedback for the person who clicked it
        setLog(error.response.data);
        setStatus("VOC_INITIALIZED");
      }
    }
  };

  return (
    <div className={`App ${status === "VOC_INITIALIZED" ? "toxic-bg" : ""}`}>
      <header className="App-header">
        <h1>Project Pi: Global Infection Tracker</h1>
        <div className="status-badge">System Status: {status}</div>
        
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Initial (e.g., A)" 
            value={initial}
            maxLength="1"
            onChange={(e) => setInitial(e.target.value.toUpperCase())}
          />
          <button onClick={deployMutation}>TRIGGER GLOBAL SNAP</button>
        </div>

        {log && (
          <div className="error-box">
            <h2 className="blink">⚠️ PI VARIANT DETECTED ⚠️</h2>
            <p><strong>Decree:</strong> 11-May-2019 Violation</p>
            <p><strong>Message:</strong> {log.message}</p>
            <p className="technical-detail">Kernel Panic: {log.time || new Date().toLocaleTimeString()}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;