import { useState } from "react";
import { api } from "../api";
import styles from "./Auth.module.css";

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (data.message) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setSuccess("Account created! Please sign in.");
      setTimeout(() => onSwitch(), 1500);
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.sub}>Get started for free</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Username</label>
            <input
              name="username"
              placeholder="yourname"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className={styles.switch}>
          Have an account? <span onClick={onSwitch}>Sign in</span>
        </p>
      </div>
    </div>
  );
}
