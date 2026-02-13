"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [lockout, setLockout] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const expiry = localStorage.getItem("tokenExpiry");
    if (token && expiry && Date.now() < parseInt(expiry)) {
      router.replace("/library");
      return;
    }
    const attempts = parseInt(localStorage.getItem("loginAttempts") || "0");
    const lockoutTime = parseInt(localStorage.getItem("lockoutTime") || "0");
    setLoginAttempts(attempts);
    if (lockoutTime > Date.now()) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      setError(`Account locked. Try again in ${remaining} minute(s).`);
      setLockout(true);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const remember = (form.elements.namedItem("remember") as HTMLInputElement).checked;

    setError("");
    document.querySelectorAll(".form-error").forEach((el) => el.classList.remove("show"));

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      (document.getElementById("email") as HTMLInputElement).style.borderColor = "#d63031";
      document.getElementById("emailError")?.classList.add("show");
      return;
    }
    if (!password) {
      (document.getElementById("password") as HTMLInputElement).style.borderColor = "#d63031";
      document.getElementById("passwordError")?.classList.add("show");
      return;
    }

    const attempts = loginAttempts + 1;
    setLoginAttempts(attempts);
    localStorage.setItem("loginAttempts", attempts.toString());

    if (attempts >= 5) {
      const lockoutUntil = Date.now() + 5 * 60 * 1000;
      localStorage.setItem("lockoutTime", lockoutUntil.toString());
      setError("Too many failed attempts. Account locked for 5 minutes.");
      setLockout(true);
      return;
    }

    if (password.length >= 6) {
      localStorage.setItem("loginAttempts", "0");
      localStorage.removeItem("lockoutTime");
      const token = "token_" + Math.random().toString(36).substr(2) + Date.now();
      const expiry = Date.now() + (remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("tokenExpiry", expiry.toString());
      localStorage.setItem("userEmail", email);
      router.push("/library");
    } else {
      setError(`Invalid credentials. ${5 - attempts} attempt(s) remaining.`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">🥭</div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue your manga journey</p>

        {error && (
          <div className="error-message show">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} id="loginForm">
          <div className="form-group">
            <label className="form-label required" htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" className="form-input" required />
            <div className="form-error" id="emailError">Please enter a valid email</div>
          </div>

          <div className="form-group">
            <label className="form-label required" htmlFor="password">Password</label>
            <input type="password" id="password" name="password" className="form-input" required />
            <div className="form-error" id="passwordError">Please enter your password</div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" style={{ fontSize: "0.875rem", color: "var(--mango-primary)", textDecoration: "none" }}>Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={lockout}>
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account? <Link href="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
