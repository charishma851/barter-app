import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./App.css";

// ✅ products AFTER imports
const products = [
  { id: 1, name: "Water Bottle", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Flashlight", image: "https://via.placeholder.com/150" },
  { id: 3, name: "Canned Food", image: "https://via.placeholder.com/150" },
  { id: 4, name: "Battery Pack", image: "https://via.placeholder.com/150" }
];

// 🔒 Face Lock Component
function FaceLock({ onUnlock }) {
  const videoRef = useRef();
  const [status, setStatus] = useState("Scanning...");

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      });
  };

  const handlePlay = () => {
    const interval = setInterval(async () => {
      const detection = await faceapi.detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detection) {
        setStatus("Face Detected ✅");
        clearInterval(interval);
        setTimeout(() => onUnlock(), 1000);
      } else {
        setStatus("❌ Access Denied");
      }
    }, 1000);
  };

  return (
    <div className="captcha">
      <h2>🔒 Face Verification Required</h2>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="300"
        height="200"
        onPlay={handlePlay}
      />
      <p>{status}</p>
    </div>
  );
}

function App() {
  const [showTrade, setShowTrade] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [tradeWith, setTradeWith] = useState(null);
const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [faceUnlock, setFaceUnlock] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(true);
  const [target] = useState(Math.floor(Math.random() * 4));

  const [positions, setPositions] = useState({});
  const [btnPos, setBtnPos] = useState({});
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [tries, setTries] = useState(0);

  // 🛒 Cart button movement
 const handleMouseMove = (e, id) => {
  const rect = e.target.getBoundingClientRect();

  const bx = rect.left + rect.width / 2;
  const by = rect.top + rect.height / 2;

  const dx = e.clientX - bx;
  const dy = e.clientY - by;

  const distance = Math.sqrt(dx * dx + dy * dy);

  // 👇 React based on distance
  if (distance < 150) {
    const strength = (150 - distance) / 150; // closer = stronger

    let moveX = -dx * strength * 0.8;
    let moveY = -dy * strength * 0.8;

    // 👇 LIMIT movement (VERY IMPORTANT for trappable)
    const max = 40;

    moveX = Math.max(-max, Math.min(max, moveX));
    moveY = Math.max(-max, Math.min(max, moveY));

    setPositions((prev) => ({
      ...prev,
      [id]: {
        x: (prev[id]?.x || 0) + moveX,
        y: (prev[id]?.y || 0) + moveY
      }
    }));
  }
};

  // 🔒 Face lock FIRST
  if (!faceUnlock) {
    return <FaceLock onUnlock={() => setFaceUnlock(true)} />;
  }

  // 💀 CAPTCHA
  if (showCaptcha) {
    return (
      <div
        className="captcha"
        onMouseMove={(e) =>
          setMouse({ x: e.clientX, y: e.clientY })
        }
      >
        <h2>⚠ Click SAFE zones (NOT 🔥)</h2>

        <div className="captcha-grid">
          {[0, 1, 2, 3].map((i) => {
            const pos = btnPos[i] || { x: 0, y: 0 };

            return (
              <button
                key={i}
                className="captcha-btn"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`
                }}
                onMouseMove={(e) => {
                  const rect = e.target.getBoundingClientRect();

                  const bx = rect.left + rect.width / 2;
                  const by = rect.top + rect.height / 2;

                  const distance = Math.sqrt(
                    (mouse.x - bx) ** 2 +
                    (mouse.y - by) ** 2
                  );

                  const maxMove = 80;

                  if (distance < 120 && tries < 5) {
                    let moveX = (bx - mouse.x) * 2;
                    let moveY = (by - mouse.y) * 2;

                    moveX = Math.max(-maxMove, Math.min(maxMove, moveX));
                    moveY = Math.max(-maxMove, Math.min(maxMove, moveY));

                    setBtnPos((prev) => ({
                      ...prev,
                      [i]: {
                        x: moveX,
                        y: moveY
                      }
                    }));
                  }
                }}
                onClick={() => {
                  if (i === target) {
                    alert("😒 Fine... Access Granted");
                    setShowCaptcha(false);
                  } else {
                    alert("❌ WRONG. TRY AGAIN.");
                    setTries((prev) => prev + 1);
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

  // 🛒 MAIN APP
  // 🛒 MAIN APP
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
              transform: `translate(${positions[item.id]?.x || 0}px, ${
                positions[item.id]?.y || 0
              }px)`
            }}
            onMouseMove={(e) => handleMouseMove(e, item.id)}
            onClick={() => {
              setSelectedItem(item);   // ✅ store full object
              setShowPopup(true);
            }}
          >
            🛒 😰
          </button>
        </div>
      ))}
    </div>

    {/* 🚨 INTERRUPT POPUP */}
    {showPopup && (
      <div className="popup">
        <div className="popup-box">
          <h2>⚠ Trade Interrupted</h2>
          <p>{selectedItem?.name} cannot be traded right now</p>
          <p>Radiation spike detected ☢</p>

          <button
            onClick={() => {
              setShowPopup(false);
              setShowTrade(true);
            }}
          >
            Continue Trade
          </button>
        </div>
      </div>
    )}

    {/* 🔄 TRADE SYSTEM */}
    {showTrade && (
      <div className="popup">
        <div className="popup-box">
          <h2>🔄 Trade {selectedItem?.name}</h2>

          <p>Select item to exchange:</p>

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
            <button
              onClick={() => {
                setSuccess(true);
                setTimeout(() => {
                  setShowTrade(false);
                  setSuccess(false);
                  setTradeWith(null);
                }, 1500);
              }}
            >
              🔄 Trade
            </button>
          )}

          {success && <p>✅ Trade Successful!</p>}

          <button onClick={() => setShowTrade(false)}>❌</button>
        </div>
      </div>
    )}
  </div>
);
}

export default App;