import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar">
      <div className="logo">
        💪 FitTrack AI
      </div>

      <div className="nav-links">
        <NavItem to="/dashboard" label="Dashboard" location={location} />
        <NavItem to="/progress" label="Progress" location={location} />
        <NavItem to="/weight" label="Weight" location={location} />
        <NavItem to="/profile" label="Profile" location={location} />

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function NavItem({ to, label, location }) {
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`nav-item ${isActive ? "active" : ""}`}
    >
      {label}
    </Link>
  );
}

export default Navbar;
