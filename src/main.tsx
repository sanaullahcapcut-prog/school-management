import React from "react";
import ReactDOM from "react-dom/client";

// App.tsx is at the repo root (../ from /src)
import App from "../App";
import "../index.css";

import OfflineGate from "./components/OfflineGate";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OfflineGate>
      <App />
    </OfflineGate>
  </React.StrictMode>
);
