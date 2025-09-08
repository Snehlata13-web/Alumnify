import { useState } from "react";
import { Menu, X } from "lucide-react"; // lucide-react icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/Logo-Alumnify.png" alt="logo" className="h-9 w-auto" />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Contact
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-5 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              Log in
            </button>
            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Register
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md rounded-b-lg">
          <div className="px-6 py-4 space-y-4">
            <a
              href="#"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              About
            </a>
            <a
              href="#"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              Contact
            </a>
            <div className="flex flex-col gap-3 pt-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">
                Log in
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
