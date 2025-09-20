import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";       // <-- App.tsx inside src
import "./index.css";          // <-- index.css inside src (adjust if needed)

import OfflineGate from "./components/OfflineGate";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OfflineGate>
      <App />
    </OfflineGate>
  </React.StrictMode>
);
