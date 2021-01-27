import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "./index.css";
import { RootStoreProvider } from "./store/store";

ReactDOM.render(
  <React.StrictMode>
    <RootStoreProvider>
      <App />
    </RootStoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
