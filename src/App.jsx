import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PhysicianDashboard from "./pages/PhysicianDashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { Provider } from 'react-redux';
import { store } from './app/store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/*routes*/}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PhysicianDashboard />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
