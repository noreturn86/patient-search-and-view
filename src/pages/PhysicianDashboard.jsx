import { useState } from "react";
import ChronicIssuePanel from "../components/ChronicIssuePanel";
import Patients from "./Patients";

export default function PhysicianDashboard() {
  const [activeTab, setActiveTab] = useState("Patients");

  const tabs = ["Schedule", "Patients", "Documents", "Messages"];

  return (
    <div className="flex h-screen">
      {/*left nav bar*/}
      <div className="w-64 bg-gray-800 text-white flex flex-col gap-2">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Dashboard
        </div>
        <nav className="flex-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`w-full text-left px-4 py-3 transition ${
                activeTab === tab ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="flex items-center justify-center text-center text-lg border rounded m-2 p-2">
            This is a demo of the patient search and display function. Other tabs are not available.
          </div>
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
