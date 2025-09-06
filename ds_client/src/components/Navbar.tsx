import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-500 text-white shadow-md px-6 py-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          ExpensesTracker
        </Link>

        {/* Hamburger button (small screens) */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Links (desktop*/}
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="hover:text-gray-200 hover:underline">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-200 hover:underline">
                Dashboard
              </Link>
              <Link to="/expenses" className="hover:text-gray-200 hover:underline">
                Expenses
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-200 hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-200 hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Mobile menu (visible when isOpen = true) */}
      {isOpen && (
        <div className="md:hidden mt-3 space-y-2 flex flex-col">
            <Link
            to="/"
            className="hover:text-gray-200 hover:underline"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          {user? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-gray-200 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/expenses"
                className="hover:text-gray-200 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Expenses
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-left w-[20%]"
              >
                Logout
              </button>
            </>
          ): (
            <>
              <Link
                to="/login"
                className="hover:text-gray-200 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-gray-200 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
