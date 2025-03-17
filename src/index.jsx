import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./Redux/store.js";
import { LanguageProvider } from './context/LanguageContext';
import { GoogleOAuthProvider } from "@react-oauth/google";

// Your Google OAuth Client ID
const clientId = "41140740599-v88sga4r1f0p7u4lb642rf8el3m6p7d3.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root")); // Create a root
root.render(
  <Provider store={store}>
    <LanguageProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <React.StrictMode>
          <ToastContainer autoClose={1000} />
          <App />
        </React.StrictMode>
      </GoogleOAuthProvider>
    </LanguageProvider>
  </Provider>
);
