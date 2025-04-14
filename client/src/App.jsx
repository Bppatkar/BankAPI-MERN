import React from "react";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-blue-700 text-white p-4 text-2xl font-bold shadow">
        BANKAPI Dashboard
      </header>
      <main className="p-6">
        <Dashboard />
      </main>
    </div>
  );
}