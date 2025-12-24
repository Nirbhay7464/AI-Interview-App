import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

function Dashboard() {
  return (
    <div className="w-full">
      <h2 className="font-bold text-2xl">Dashboard</h2>
      <p className="text-gray-500 mb-6">
        Create and start your AI mock interview
      </p>

      {/* Add New Interview */}
      <div className="mb-10">
        <AddNewInterview />
      </div>

      {/* Previous Interviews */}
      <InterviewList />
    </div>
  );
}

export default Dashboard;
