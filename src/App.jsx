import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PhysicianDashboard from "./pages/PhysicianDashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/*routes*/}
        <Route path="/" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PhysicianDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
