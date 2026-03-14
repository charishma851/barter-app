import React from "react";
import "./App.css";

const products = [
  { id: 1, name: "Water Bottle", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Flashlight", image: "https://via.placeholder.com/150" },
  { id: 3, name: "Canned Food", image: "https://via.placeholder.com/150" },
  { id: 4, name: "Battery Pack", image: "https://via.placeholder.com/150" }
];

function App() {
  return (
    <div className="app">
      <h1>☠ Survival Barter Market</h1>

      <div className="grid">
        {products.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>

            {/* ICON ONLY BUTTON */}
            <button className="cart-btn">🛒</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;