import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "student@polarconnect.test", password: "ChangeMe123", role: "student" });
  const [error, setError] = useState("");

  if (user) return <Navigate to="/dashboard" replace />;

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") await login({ email: form.email, password: form.password });
      else await register(form);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div>
          <p className="eyebrow">Polar Science Portal</p>
          <h1>PolarConnect</h1>
          <p>Search approved research, ask cited AI questions, explore Antarctic stations, and learn through Polar Academy.</p>
        </div>
        <form onSubmit={submit}>
          <div className="segmented">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
            <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Register</button>
          </div>
          {mode === "register" && (
            <>
              <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
              <label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="student">Student</option><option value="researcher">Researcher</option><option value="admin">Admin</option></select></label>
            </>
          )}
          <label>Email<input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit">{mode === "login" ? "Login" : "Create account"}</button>
        </form>
      </section>
    </main>
  );
}
