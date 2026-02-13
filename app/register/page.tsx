"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function validatePassword(pwd: string) {
  return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd);
}

export default function RegisterPage() {
  const router = useRouter();
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);
  const [passwordReqs, setPasswordReqs] = useState({ length: false, upper: false, lower: false, number: false });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const expiry = localStorage.getItem("tokenExpiry");
    if (token && expiry && Date.now() < parseInt(expiry)) {
      router.replace("/library");
    }
  }, [router]);

  const checkStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength <= 2 ? "weak" : strength <= 4 ? "medium" : "strong");
    setPasswordReqs({
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement).value.trim();
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement).value.trim();
    const username = (form.elements.namedItem("username") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;
    const terms = (form.elements.namedItem("terms") as HTMLInputElement).checked;

    document.querySelectorAll(".form-error").forEach((el) => el.classList.remove("show"));
    document.querySelectorAll(".form-input").forEach((el) => (el as HTMLElement).style.borderColor = "#e0e0e0");

    let valid = true;
    if (!firstName) { document.getElementById("firstNameError")?.classList.add("show"); (document.getElementById("firstName") as HTMLInputElement).style.borderColor = "#d63031"; valid = false; }
    if (!lastName) { document.getElementById("lastNameError")?.classList.add("show"); (document.getElementById("lastName") as HTMLInputElement).style.borderColor = "#d63031"; valid = false; }
    if (username.length < 3) { document.getElementById("usernameError")?.classList.add("show"); (document.getElementById("username") as HTMLInputElement).style.borderColor = "#d63031"; valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById("emailError")?.classList.add("show"); (document.getElementById("email") as HTMLInputElement).style.borderColor = "#d63031"; valid = false; }
    if (!validatePassword(password)) { document.getElementById("passwordError")?.classList.add("show"); (document.getElementById("password") as HTMLInputElement).style.borderColor = "#d63031"; valid = false; }
    if (password !== confirmPassword) { document.getElementById("confirmPasswordError")?.classList.add("show"); (document.getElementById("confirmPassword") as HTMLInputElement).style.borderColor = "#d63031"; valid = false; }
    if (!terms) { alert("Please accept the Terms of Service"); valid = false; }

    if (valid) {
      const token = "token_" + Math.random().toString(36).substr(2) + Date.now();
      const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("tokenExpiry", expiry.toString());
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", `${firstName} ${lastName}`);
      localStorage.setItem("username", username);
      router.push("/library");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box register">
        <div className="auth-logo">🥭</div>
        <h1 className="auth-title">Join MangaMangos</h1>
        <p className="auth-subtitle">Start your manga journey today</p>

        <form onSubmit={handleSubmit} id="registerForm">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required" htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" className="form-input" required />
              <div className="form-error" id="firstNameError">Please enter your first name</div>
            </div>
            <div className="form-group">
              <label className="form-label required" htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" className="form-input" required />
              <div className="form-error" id="lastNameError">Please enter your last name</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required" htmlFor="username">Username</label>
            <input type="text" id="username" name="username" className="form-input" required />
            <div className="form-error" id="usernameError">Username must be at least 3 characters</div>
          </div>

          <div className="form-group">
            <label className="form-label required" htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" className="form-input" required />
            <div className="form-error" id="emailError">Please enter a valid email</div>
          </div>

          <div className="form-group">
            <label className="form-label required" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              required
              onChange={(e) => checkStrength(e.target.value)}
            />
            <div className="password-strength">
              <div className={`password-strength-bar ${passwordStrength || ""}`} />
            </div>
            <ul className="password-requirements">
              <li className={passwordReqs.length ? "valid" : ""}>At least 8 characters</li>
              <li className={passwordReqs.upper ? "valid" : ""}>One uppercase letter</li>
              <li className={passwordReqs.lower ? "valid" : ""}>One lowercase letter</li>
              <li className={passwordReqs.number ? "valid" : ""}>One number</li>
            </ul>
          </div>

          <div className="form-group">
            <label className="form-label required" htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" className="form-input" required />
            <div className="form-error" id="confirmPasswordError">Passwords do not match</div>
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="terms" name="terms" required />
            <label htmlFor="terms">I agree to the Terms of Service and Privacy Policy</label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
