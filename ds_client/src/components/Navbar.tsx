import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold">
        ExpensesTracker
      </Link>

      {/* Links */}
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-gray-200">
          Home
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-gray-200">
              Dashboard
            </Link>
            <Link to="/expenses" className="hover:text-gray-200">
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
            <Link to="/login" className="hover:text-gray-200">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-200">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
