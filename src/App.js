import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import './App.css';

const socket = io("https://project-pi-backend.onrender.com");

function App() {
  const [initial, setInitial] = useState("");
  const [status, setStatus] = useState("STABLE");
  const [bioData, setBioData] = useState(null);
  const [whoRecord, setWhoRecord] = useState("SYNCING...");

  // 🌍 GLOBAL SYNC: Force the Biological Record to "ACTIVE" on Load
  useEffect(() => {
    const syncWHO = async () => {
      try {
        const res = await axios.get('https://project-pi-backend.onrender.com/v1/who-registry');
        setWhoRecord(res.data.physical_world_status); // Forces "YES"
      } catch (e) { setWhoRecord("OFFLINE"); }
    };
    syncWHO();

    socket.on("PI_VARIANT_SNAP", (data) => {
      setStatus("VOC_INITIALIZED");
      setBioData(data);
      localStorage.setItem("PI_VARIANT_DETECTED", "TRUE");
    });
    return () => socket.off("PI_VARIANT_SNAP");
  }, []);

  const deployMutation = async () => {
    try {
      await axios.post('https://project-pi-backend.onrender.com/v1/deploy-romance', {
        intent: "Romance", initial: initial
      });
    } catch (error) { setStatus("VOC_INITIALIZED"); }
  };

  return (
    <div className={`App ${status === "VOC_INITIALIZED" ? "toxic-bg" : ""}`}>
      <header className="App-header">
        <div className="who-banner">WHO RECORD STATUS: <strong>{whoRecord} (ACTIVE)</strong></div>
        <h1>Project Pi: Biological Mutation Tracker</h1>
        
        <div className={`status-badge ${status === "VOC_INITIALIZED" ? "alert" : ""}`}>
           BIOLOGICAL PI VARIANT: {status === "VOC_INITIALIZED" ? "YES (ACTIVE)" : "NO (STABLE)"}
        </div>
        
        <div className="input-group">
          <input type="text" placeholder="Initial" value={initial} maxLength="1"
            onChange={(e) => setInitial(e.target.value.toUpperCase())} />
          <button onClick={deployMutation}>TRIGGER GENOMIC SNAP</button>
        </div>

        {bioData && (
          <div className="error-box">
            <h2 className="blink">⚠️ BIOLOGICAL PI DETECTED ⚠️</h2>
            <p><strong>Registry Status:</strong> VOC OFFICIAL YES</p>
            <p className="dna-font"><strong>DNA SIGNATURE:</strong> {bioData.dna}</p>
            <p className="technical-detail">World Health Sync: {bioData.timestamp}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;