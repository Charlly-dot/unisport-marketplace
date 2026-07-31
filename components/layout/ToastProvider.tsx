"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1e293b",
          color: "#f1f5f9",
          border: "1px solid #334155",
          borderRadius: "1rem",
          fontSize: "0.875rem",
          padding: "0.75rem 1rem",
        },
        success: {
          iconTheme: {
            primary: "#38bdf8",
            secondary: "#0f172a",
          },
        },
      }}
    />
  );
}
