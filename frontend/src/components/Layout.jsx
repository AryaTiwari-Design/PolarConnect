import { Link, NavLink, Outlet } from "react-router-dom";
import { Bot, Compass, GraduationCap, Library, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Compass },
  { to: "/research", label: "Research", icon: Library },
  { to: "/chat", label: "AI Assistant", icon: Bot },
  { to: "/map", label: "Map", icon: Compass },
  { to: "/academy", label: "Academy", icon: GraduationCap },
];

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/dashboard">
          <span className="brand-mark">PC</span>
          <span>PolarConnect</span>
        </Link>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
          {user?.role === "admin" && (
            <NavLink to="/admin">
              <ShieldCheck size={18} />
              Admin
            </NavLink>
          )}
        </nav>
        <div className="profile">
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>
          <button onClick={logout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}
