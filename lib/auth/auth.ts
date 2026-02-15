"use client";

export function checkAuth(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("accessToken");
  const expiry = localStorage.getItem("tokenExpiry");
  if (!token || !expiry || Date.now() >= parseInt(expiry)) {
    return false;
  }
  return true;
}

export function logout(): void {
  if (typeof window === "undefined") return;
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("username");
  }
}
