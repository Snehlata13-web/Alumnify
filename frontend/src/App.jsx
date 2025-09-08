import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
