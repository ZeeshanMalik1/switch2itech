import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Context Imports
import { ThemeProvider } from "./components/Layout/ThemeContext.jsx";
import ContextProvider from "./context/ContextProvider.jsx"

import "./index.css";
import App from "./App.jsx";

axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ContextProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ContextProvider>
    </BrowserRouter>
  </StrictMode>
);
