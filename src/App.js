import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [initial, setInitial] = useState("");
  const [status, setStatus] = useState("STABLE");
  const [log, setLog] = useState(null);

  // TECH ELECTIVE: WEB3 SIMULATION [Page 3]
  // This verifies the 'Decree' is locked on the Universal Ledger
  const verifyBlockchainDecree = () => {
    console.log("--- WEB3 AUDIT: CONNECTING TO DISTRIBUTED LEDGER ---");
    const decreeIsLocked = true; 
    console.log("DECREE STATUS: 11-MAY-2019 IS IMMUTABLE.");
    return decreeIsLocked;
  };

  const deployMutation = async () => {
    // Every deployment must check the Blockchain first
    if (!verifyBlockchainDecree()) return;

    try {
      const response = await axios.post('https://project-pi-backend.onrender.com/v1/deploy-romance', {
    intent: "Romance",
    initial: initial
});
      setStatus(response.data.status);
    } catch (error) {
      if (error.response) {
        setLog(error.response.data);
        setStatus("VOC_INITIALIZED");
        
        // TECH ELECTIVE: PWA PERSISTENCE [Page 1]
        // Save the 'Infection' to Local Storage so it stays even if offline
        localStorage.setItem("PI_VARIANT_DETECTED", "TRUE");
      }
    }
  };

  // CHECK FOR PREVIOUS INFECTION ON LOAD
  useEffect(() => {
    const previousInfection = localStorage.getItem("PI_VARIANT_DETECTED");
    if (previousInfection === "TRUE") {
      setStatus("VOC_INITIALIZED");
      setLog({
        cause: "Persistent_PWA_Mutation",
        message: "The Pi Variant remains active in your local node cache."
      });
    }
  }, []);

  return (
    <div className={`App ${status === "VOC_INITIALIZED" ? "toxic-bg" : ""}`}>
      <header className="App-header">
        <h1>Project Pi: Global Infection Tracker</h1>
        <div className="status-badge">System Status: {status}</div>
        <p className="vocation-tag">Vocation: B.E. EXTC (Engineer)</p>
        
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Enter Prohibited Initial (e.g., A)" 
            value={initial}
            maxLength="1"
            onChange={(e) => setInitial(e.target.value.toUpperCase())}
          />
          <button onClick={deployMutation}>PUSH IMMUTABLE SIGNAL</button>
        </div>

        {log && (
          <div className="error-box">
            <h2 className="blink">⚠️ PI VARIANT DETECTED ⚠️</h2>
            <p><strong>Decree:</strong> 11-May-2019 (Immutable Smart Contract)</p>
            <p><strong>Message:</strong> {log.message}</p>
            <p className="technical-detail">Block Hash: 0xPi{Math.random().toString(16).slice(2)}</p>
            <p className="technical-detail">Timestamp: {new Date().toLocaleTimeString()}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;