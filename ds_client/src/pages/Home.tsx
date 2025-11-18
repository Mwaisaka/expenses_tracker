import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Image from "../../public/Home.jpg"

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl px-6 py-10">

      {/*Left column */}
      <div className="flex flex-col items-center justify-center text-center px-4 bg-gradient-to-r from-gray-50 to-gray-300 rounded-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-700">
          Welcome to Expenses Tracker
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage your income, expenses, and savings all in one place.
        </p>

        
        {/* FEATURE CARDS */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700">
          Key feautures
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">

          {/* Card 1 */}
          <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Track Expenses</h3>
            <p className="text-gray-600">
              Record your spending and categorize expenses for better financial control.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Manage Income</h3>
            <p className="text-gray-600">
              Keep track of all income sources and view your monthly totals.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Smart Insights</h3>
            <p className="text-gray-600">
              Visualize financial trends with charts and detailed summaries.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Goals & Savings</h3>
            <p className="text-gray-600">
              Set financial goals and automatically track your progress.
            </p>
          </div>

        </div>
        {user ? (
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="space-x-4 mb-6">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Login
            </Link>
            {/* <Link
            to="/register"
            className="bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Register
          </Link> */}
          </div>
        )}
      </div>

      {/*Right column*/}
      <div className="flex items-center justify-center p-6">
        <img
          src={Image}
          alt="Expenses Tracker"
          className="w-full max-w-full md:max-w-lg h-auto rounded-xl shadow-lg object-cover"
          
        />
      </div>

    </div>
  );
}
