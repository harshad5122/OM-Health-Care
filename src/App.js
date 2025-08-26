import React from "react";
import { Routes, Route, useLocation  } from 'react-router-dom';
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


function App() {
  const location = useLocation();

  const hideFloatingButton =
    location.pathname.startsWith("/auth/login") ||
    location.pathname.startsWith("/auth/register")||
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
          <Route path="/chat" element={<Chat />} />
        </Route>

        {/* Auth routes without Navbar/Footer */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
      {/* <FloatingChatButton /> */}
        {!hideFloatingButton && <FloatingChatButton />}
    </div>
  );
}

export default App;