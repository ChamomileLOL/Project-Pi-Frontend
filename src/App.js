import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import './App.css';

const socket = io("https://project-pi-backend.onrender.com");

function App() {
  const [initial, setInitial] = useState("");
  const [status, setStatus] = useState("STABLE");
  const [bioData, setBioData] = useState(null);

  useEffect(() => {
    socket.on("PI_VARIANT_SNAP", (data) => {
      setStatus("VOC_INITIALIZED");
      setBioData(data); // Stores the DNA and YES status
      localStorage.setItem("PI_VARIANT_DETECTED", "TRUE");
    });
    return () => socket.off("PI_VARIANT_SNAP");
  }, []);

  const deployMutation = async () => {
    try {
      await axios.post('https://project-pi-backend.onrender.com/v1/deploy-romance', {
        intent: "Romance",
        initial: initial
      });
    } catch (error) {
      if (error.response) setStatus("VOC_INITIALIZED");
    }
  };

  return (
    <div className={`App ${status === "VOC_INITIALIZED" ? "toxic-bg" : ""}`}>
      <header className="App-header">
        <h1>Project Pi: Biological Mutation Tracker</h1>
        
        {/* THE "YES" INDICATOR */}
        <div className={`status-badge ${status === "VOC_INITIALIZED" ? "alert" : ""}`}>
           BIOLOGICAL PI VARIANT: {status === "VOC_INITIALIZED" ? "YES (ACTIVE)" : "NO (STABLE)"}
        </div>
        
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Initial (e.g., A)" 
            value={initial}
            onChange={(e) => setInitial(e.target.value.toUpperCase())}
          />
          <button onClick={deployMutation}>TRIGGER GENOMIC SNAP</button>
        </div>

        {bioData && (
          <div className="error-box">
            <h2 className="blink">⚠️ BIOLOGICAL PI DETECTED ⚠️</h2>
            <p><strong>Status:</strong> VOC OFFICIAL YES</p>
            <p className="dna-font"><strong>DNA SIGNATURE:</strong> {bioData.dna}</p>
            <p className="technical-detail">World Health Sync: {bioData.timestamp}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;