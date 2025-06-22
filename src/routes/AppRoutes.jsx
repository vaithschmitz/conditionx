// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Overview from "../pages/dashboard/Overview";
import Climbing from "../pages/dashboard/Climbing";
import Recovery from "../pages/dashboard/Recovery";
import Conditioning from "../pages/dashboard/Conditioning";
import Yoga from "../pages/dashboard/Yoga";
import Cardio from "../pages/dashboard/Cardio";
import Log from "../pages/dashboard/Log";

import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/AppLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Layout with Navbar */}
      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/overview" element={<Overview />} />
          <Route path="/climbing" element={<Climbing />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/conditioning" element={<Conditioning />} />
          <Route path="/yoga" element={<Yoga />} />
          <Route path="/cardio" element={<Cardio />} />
          <Route path="/log" element={<Log />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
