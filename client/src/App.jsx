import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth.context.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Homepage.jsx";
import Login from "./pages/LoginPage.jsx";
import Signup from "./pages/SignupPage.jsx";
import Profile from "./pages/UserProfilePage.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="layout">
          <Navbar />
          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
