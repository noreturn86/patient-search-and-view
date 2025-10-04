import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PhysicianDashboard from "./pages/PhysicianDashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/*redirect root to /dashboard*/}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/*routes*/}
        <Route path="/dashboard" element={<PhysicianDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
