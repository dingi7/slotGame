import "./index.css";

import App from "./App.tsx";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT" ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  )
);
