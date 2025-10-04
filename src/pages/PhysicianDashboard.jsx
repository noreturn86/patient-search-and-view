import { useState } from "react";
import ChronicIssuePanel from "../components/ChronicIssuePanel";
import Patients from "./Patients";

export default function PhysicianDashboard() {
  const [activeTab, setActiveTab] = useState("Schedule");

  const tabs = ["Schedule", "Patients", "Documents", "Messages"];

  return (
    <div className="flex h-screen">
      {/*left nav bar*/}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Dashboard
        </div>
        <nav className="flex-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition ${
                activeTab === tab ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button className="w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition">
            Log Out
          </button>
        </div>
      </div>

      {/*main content*/}
      <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
        <Patients />
      </div>
    </div>
  );
}
