import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { serviceUrl } from "../../Services/url";

// const serviceUrl = "https://your-api-url.com"; // Replace with your API URL

const AutoBackup = () => {
  const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(false);
  const [backupIntervalDays, setBackupIntervalDays] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [isCronScheduled, setIsCronScheduled] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      setAccessToken(response.access_token);
      localStorage.setItem("google_access_token", response.access_token);
      toast.success("Logged into Google Drive successfully!");
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      toast.error("Failed to log in to Google Drive.");
    },
    scope: "https://www.googleapis.com/auth/drive.file",
  });

  const scheduleAutoBackup = async () => {
    const response = await axios.post(
      `${serviceUrl}/backup/scheduleCronJob`,
      { backupIntervalDays: backupIntervalDays, accessToken: accessToken },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      toast.success(
        response.data.message || "Auto Backup scheduled successfully!"
      );
    } else {
      toast.error("Something went wrong while scheduling auto backup.");
    }
  };

  const toggleAutoBackup = () => {
    if (!isAutoBackupEnabled) {
      login(); // Log in to Google Drive
    }
    setIsAutoBackupEnabled(!isAutoBackupEnabled);
  };

  return (
    <div className="container p-6">
      <Toaster />
      <h1 className="text-xl font-bold mb-4">Auto Backup Settings</h1>
      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isAutoBackupEnabled}
            onChange={toggleAutoBackup}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Enable Auto Backup</span>
        </label>

        {isAutoBackupEnabled && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Backup Interval (in days):
              </label>
              <input
                type="number"
                value={backupIntervalDays}
                onChange={(e) => setBackupIntervalDays(e.target.value)}
                className="block w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
              />
            </div>

            <button
              onClick={scheduleAutoBackup}
              disabled={isCronScheduled}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
            >
              {isCronScheduled
                ? "Auto Backup Scheduled"
                : "Schedule Auto Backup"}
            </button>

            {isCronScheduled && (
              <div className="text-sm text-green-600 mt-2">
                Auto Backup is scheduled every {backupIntervalDays} days.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AutoBackup;
