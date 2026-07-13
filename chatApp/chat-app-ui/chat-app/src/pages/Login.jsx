import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";
import styles from "./Auth.module.css";

export default function Login({ onSwitch }) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayOtp, setDisplayOtp] = useState(false)
  const [userOtp, setUserOtp] = useState(0)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (data.message) {
        setError(data.message);
        setLoading(false);
        return;
      }
      console.log('valid user show otp screen');

      setDisplayOtp(true);
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  const ValidateOtp = async () => {
    try {
      const data = await api("/auth/Validate", {
        method: "POST",
        body: JSON.stringify({ otp: userOtp }),
      });
      if (data) {
        console.log('validated successfully');

        login(data.user, data.token);
      } else {
        console.log('something went wrong');

      }
    } catch {
      setError("Something went wrong");
    }
  }

  useEffect(() => {
    console.log('opt generated');

  }, [displayOtp])

  return (
    <div className={styles.wrap}>
      {!displayOtp &&
        <div className={styles.box}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.sub}>Sign in to continue</p>

          <form onSubmit={handleSubmit}>
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

            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className={styles.switch}>
            No account?{" "}
            <span onClick={onSwitch}>Register</span>
          </p>
        </div>
      }
      {displayOtp &&
        <div className={styles.box}>
          <h1 className={styles.title}>OTP Varification..</h1>
          <p className={styles.sub}>Please Enter OTP</p>

          <form onSubmit={ValidateOtp}>
            <div className={styles.field}>
              <label>Email</label>
              <input
                name="otp"
                type="number"
                placeholder="you@email.com"
                value={userOtp}
                onChange={(e) => setUserOtp(e.target.value)}
                required
              />
            </div>



            <button className={styles.btn} type="submit">
              {"Validate OTP"}
            </button>
          </form>

          <p className={styles.switch}>
            <span onClick={() => { setDisplayOtp(false) }}>back</span>
          </p>
        </div>
      }
    </div>
  );
}
