"use client";

import Header from "./components/Header";
import DashboardStats from "./components/dashboard-stats";
import DashboardTabs from "./components/dashboard-tabs";

export default function DashBoard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header></Header>

      <DashboardStats />

      <DashboardTabs />
    </div>
  );
}
