import { Link } from "react-router-dom";
import { useAuthContext } from "../context/auth.context.jsx";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const [open, setOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0].toUpperCase())
        .join("")
    : "";

  return (
    <header className="header">
      <nav className="nav">
        {/* Left: Brand Logo */}
        <Link className="brand" to="/">
          <img className="logo" src="/logo.jpg" alt="Break Free Logo" />
         𝘉𝘳𝘦𝘢𝘬 𝘍𝘳𝘦𝘦
        </Link>

        {/* Right side */}
        <div className="nav-right">
          {!user && (
            <>
              <Link className="nav-link" to="/login">
                Log in
              </Link>
              <Link className="nav-link" to="/signup">
                Sign up
              </Link>
            </>
          )}

          {user && (
            <div className="user-menu">
              <div
                className="avatar"
                onClick={() => setOpen((prev) => !prev)}
              >
                {initials || "U"}
              </div>

              {open && (
                <div className="dropdown">
                  <Link className="dropdown-link" to="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </Link>
                  <button
                    className="dropdown-link"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
