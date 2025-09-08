import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import AlumniDashboard from "./pages/AlumniDashboard";
import InstitutionDashboard from "./pages/InstitutionDashboard";
import StudentDashboard from "./pages/StudentDashboard";

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
        <Route path="/" element={user ? (user.role === 'alumni' ? <Navigate to="/alumni-dashboard" /> : user.role === 'institution' ? <Navigate to="/institution-dashboard" /> : user.role === 'student' ? <Navigate to="/student-dashboard" /> : <Home />) : <Home />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'alumni' ? '/alumni-dashboard' : user.role === 'institution' ? '/institution-dashboard' : '/student-dashboard'} /> : <Login />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/register" element={<Register />} />
        <Route path="/alumni-dashboard" element={user && user.role === 'alumni' ? <AlumniDashboard /> : <Navigate to="/login" />} />
        <Route path="/institution-dashboard" element={user && user.role === 'institution' ? <InstitutionDashboard /> : <Navigate to="/login" />} />
        <Route path="/student-dashboard" element={user && user.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}
