import React from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Team from "./pages/Team";
import Testimonials from "./pages/Testimonials";
import BookAppointment from "./pages/BookAppointment";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Signup";
import FloatingChatButton from "./components/FloatingChatButton";
import Chat from "./pages/chat";

import ProtectedRoute from "./pages/auth/ProtectedRoute";
import AdminDashboard from "./dashboard/AdminDashboard";
import StaffDashboard from "./dashboard/StaffDashboard";
import UserDashboard from "./dashboard/UserDashboard";

import Dashboard from "./dashboard/pages/Dashboard";
import Profile from "./dashboard/pages/Profile";
import AddDoctor from "./dashboard/pages/AddDoctor";
import AddUser from "./dashboard/pages/AddUser";
import Members from "./dashboard/pages/Members";
import ChangePassword from "./pages/auth/ResetPassword";
// import Messages from "./dashboard/pages/Messages";


function App() {
  const location = useLocation();

  const hideFloatingButton =
    location.pathname.startsWith("/auth/login") ||
    location.pathname.startsWith("/auth/register") ||
    location.pathname.startsWith("/dashboard/") ||
    location.pathname.startsWith("/chat");

  return (
    <div className="App">
      <Routes>
        {/* Routes with Navbar and Footer */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/appointment" element={<BookAppointment />} />
          {/* <Route path="/chat" element={<Chat />} /> */}
        </Route>

        {/* Auth routes without Navbar/Footer */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="change-password" element={<ChangePassword />} />

        </Route>
        <Route path="/chat" element={<Chat />} />

        {/* Dashboard routes (protected) */}
        {/* <Route
          path="/dashboard/admin/*"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/staff/*"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/user/*"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        /> */}
        {/* Admin Dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard title="Admin Home" />} />
          <Route path="home" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Chat />} />
          <Route path="add-doctor" element={<AddDoctor />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="members" element={<Members />} />
        </Route>

        {/* Staff Dashboard */}
        <Route
          path="/dashboard/staff"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard title="Staff Home" />} />
          <Route path="home" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Chat />} />
        </Route>

        {/* User Dashboard */}
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard title="User Home" />} />
          <Route path="home" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Chat />} />
        </Route>
      </Routes>
      {/* <FloatingChatButton /> */}
      {!hideFloatingButton && <FloatingChatButton />}
    </div>
  );
}

export default App;