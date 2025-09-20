import React from "react";
import ReactDOM from "react-dom/client";
import App from "../App";         // if App.tsx is at repo root
// If your App.tsx is inside src/, use: import App from "./App";
import "../index.css";           // adjust to "./index.css" if your CSS is in src
import OfflineGate from "./components/OfflineGate";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OfflineGate>
      <App />
    </OfflineGate>
  </React.StrictMode>
);
