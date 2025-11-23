import { useState } from "react";
import Patients from "./Patients";
import Schedule from "./Schedule";
import { useSelector, useDispatch } from 'react-redux';
import { clearProvider } from '../features/auth/authSlice';

export default function PhysicianDashboard() {
  const [activeTab, setActiveTab] = useState("Schedule");
  const dispatch = useDispatch();

  const tabs = ["Schedule", "Patients", "Documents", "Messages"];
  const provider = useSelector((state) => state.auth.provider);

  const handleLogout = () => {
    // Clear Redux state
    dispatch(clearProvider());

    // Clear localStorage/session
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Redirect to login
    window.location.href = '/';
  };

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
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <div className="flex items-center justify-center text-center text-lg border rounded m-2 p-2">
            This is a demo of the patient search and display function. Other tabs are not available.
          </div>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition"
          >
            Log Out
          </button>
        </div>
      </div>

      {/*main content*/}
      <div className="flex-1 flex flex-col items-center pl-3 pr-3 overflow-y-auto">
        {activeTab === "Patients" && (
          <Patients />
        )}
        {activeTab === "Schedule" && (
          <Schedule />
        )}
      </div>
    </div>
  );
}
