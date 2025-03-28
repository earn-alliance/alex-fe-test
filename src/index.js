import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// this needs to be installed properly but i doubt if react-scripts can handle scss
import "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
