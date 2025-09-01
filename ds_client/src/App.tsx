import React from "react";
import { Outlet } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// import Expenses from "./pages/Expenses";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          /> */}
          {/* <Route
            path="expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          /> */}
          {/* <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
