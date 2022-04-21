import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./index.css";
import { FiltersContextProvider } from "./lib/filters";
import { JobDataContextProvider } from "./lib/job-data";

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <JobDataContextProvider>
      <FiltersContextProvider>
        <App />
      </FiltersContextProvider>
    </JobDataContextProvider>
  </React.StrictMode>
);
