import React from "react";
import Header from "./_components/Header";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
