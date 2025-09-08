import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import About from "./components/About";
import Faqs from "./components/Faqs";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import RoleSelection from "./components/RoleSelection";

const HomePage = () => (
  <>
    <Hero />
    <Stats />
    <About />
    <Faqs />
    <Footer />
  </>
);

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
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
