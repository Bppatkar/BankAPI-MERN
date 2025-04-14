import React from "react";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-blue-600 text-white p-4 text-xl font-bold">
        BANKAPI Dashboard
      </header>
      <main className="p-4">
        <Dashboard />
      </main>
    </div>
  );
}
