import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-700">
        Welcome to Expenses Tracker
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your income, expenses, and savings all in one place.
      </p>

      {user ? (
        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
      ) : (
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gray-200 text-blue-700 px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 transition"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
