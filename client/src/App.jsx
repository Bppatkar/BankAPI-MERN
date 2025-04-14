import React from "react";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="header">BANKAPI Premium Dashboard</header>
      <main className="p-6">
        <Dashboard />
      </main>
    </div>
  );
}
