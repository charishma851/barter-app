import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./App.css";

// 🛒 Products
const products = [
  { id: 1, name: "Water Bottle", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Flashlight", image: "https://via.placeholder.com/150" },
  { id: 3, name: "Canned Food", image: "https://via.placeholder.com/150" },
  { id: 4, name: "Battery Pack", image: "https://via.placeholder.com/150" }
];

// 🔒 FACE LOCK
function FaceLock({ onUnlock }) {
  const videoRef = useRef();
  const [status, setStatus] = useState("Loading camera...");

  useEffect(() => {
    const load = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });

        videoRef.current.srcObject = stream;
        setStatus("Scanning...");
        startDetection();
      } catch {
        setStatus("Camera Error ❌");
      }
    };

    load();
  }, []);

  const startDetection = () => {
    const interval = setInterval(async () => {
      if (!videoRef.current) return;

      const detection = await faceapi.detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detection) {
        setStatus("Face Detected ✅");
        clearInterval(interval);
        setTimeout(() => onUnlock(), 1000);
      }
    }, 500);
  };

  return (
    <div className="captcha">
      <h2>🔒 Face Verification Required</h2>
      <video ref={videoRef} autoPlay muted width="300" height="200" />
      <p>{status}</p>
      <button onClick={onUnlock}>Skip 😈</button>
    </div>
  );
}

function App() {


  const [showCaptcha, setShowCaptcha] = useState(true);

  const [positions, setPositions] = useState({});
  const [btnPos, setBtnPos] = useState({});
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [tries, setTries] = useState(0);
const [escapeCount, setEscapeCount] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [showTrade, setShowTrade] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tradeWith, setTradeWith] = useState(null);
  const [success, setSuccess] = useState(false);

  const [target] = useState(Math.floor(Math.random() * 4));

  // 🛒 RUN AWAY BUTTON (FINAL FIX)
  const handleMouseMove = (e, id) => {
  const count = escapeCount[id] || 0;

  // ✅ STOP movement after 4 escapes
  if (count >= 4) return;

  const rect = e.target.getBoundingClientRect();
  const bx = rect.left + rect.width / 2;
  const by = rect.top + rect.height / 2;

  const dx = e.clientX - bx;
  const dy = e.clientY - by;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 150) {
    let moveX = (bx - e.clientX) * 2;
    let moveY = (by - e.clientY) * 2;

    // 😈 small randomness
    moveX += (Math.random() - 0.5) * 20;
    moveY += (Math.random() - 0.5) * 20;

    const max = 60;
    moveX = Math.max(-max, Math.min(max, moveX));
    moveY = Math.max(-max, Math.min(max, moveY));

    setPositions((prev) => ({
      ...prev,
      [id]: { x: moveX, y: moveY }
    }));

    // ✅ increase escape count
    setEscapeCount((prev) => ({
      ...prev,
      [id]: count + 1
    }));
  }
};
  // 💀 CAPTCHA
  if (showCaptcha) {
    return (
      <div className="captcha" onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}>
        <h2>⚠ Click SAFE zones (NOT 🔥)</h2>

        <div className="captcha-grid">
          {[0, 1, 2, 3].map((i) => {
            const pos = btnPos[i] || { x: 0, y: 0 };

            return (
              <button
                key={i}
                className="captcha-btn"
                style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                onMouseMove={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  const bx = rect.left + rect.width / 2;
                  const by = rect.top + rect.height / 2;

                  const distance = Math.sqrt((mouse.x - bx) ** 2 + (mouse.y - by) ** 2);

                  if (distance < 120 && tries < 5) {
                    setBtnPos((prev) => ({
                      ...prev,
                      [i]: {
                        x: (bx - mouse.x) * 2,
                        y: (by - mouse.y) * 2
                      }
                    }));
                  }
                }}
                onClick={() => {
                  if (i === target) {
                    setShowCaptcha(false);
                  } else {
                    setTries((p) => p + 1);
                  }
                }}
              >
                {i === target ? "🟢" : "🔥"}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>☠ Survival Barter Market</h1>

      <div className="grid">
        {products.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>

            <button
              className="cart-btn panic"
              style={{
                position: "relative",
                left: `${positions[item.id]?.x || 0}px`,
                top: `${positions[item.id]?.y || 0}px`
              }}
              onMouseMove={(e) => handleMouseMove(e, item.id)}
          onClick={() => {
  setPositions((prev) => ({
    ...prev,
    [item.id]: { x: 0, y: 0 } // reset position
  }));

  setSelectedItem(item);
  setShowPopup(true);
}}
            >
              🛒 😰
             
            </button>
          </div>
        ))}
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="popup">
          <div className="popup-box">
            <h2>⚠ Trade Interrupted</h2>
            <p>{selectedItem?.name} unavailable</p>

            <button onClick={() => { setShowPopup(false); setShowTrade(true); }}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* TRADE UI FIXED */}
      {showTrade && (
        <div className="popup">
          <div className="popup-box">
            <h2>🔄 Trade {selectedItem?.name}</h2>

            <div className="trade-options">
              {products
                .filter((p) => p.id !== selectedItem?.id)
                .map((p) => (
                  <button key={p.id} onClick={() => setTradeWith(p)}>
                    {p.name}
                  </button>
                ))}
            </div>

            {tradeWith && (
              <button className="confirm-btn" onClick={() => {
                setSuccess(true);
                setTimeout(() => {
                  setShowTrade(false);
                  setSuccess(false);
                  setTradeWith(null);
                }, 1500);
              }}>
                ✅ Confirm Trade
              </button>
            )}

            {success && <p>✅ Trade Successful!</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;