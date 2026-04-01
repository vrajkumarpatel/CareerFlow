import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import apiClient from "../../api/client";

export function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await apiClient.post("/auth/register/", { username, password });
      console.log("Signup success:", response.data);
      navigate("/login");
    } catch (err: any) {
      console.error("Signup error:", err.response?.data || err.message);
  
      const data = err.response?.data;
  
      if (data?.username?.[0]) {
        setError(data.username[0]);
      } else if (data?.password?.[0]) {
        setError(data.password[0]);
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError("Failed to create an account. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-card rounded-xl shadow-sm border border-border p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create an Account</h1>
          <p className="text-muted-foreground mb-6">Join CareerFlow to start your job search.</p>
          <form onSubmit={handleSubmit}>
          {error && (
  <p className="text-red-500 bg-red-100 px-3 py-2 rounded mb-4 text-sm">
    {error}
  </p>
)}
            <div className="mb-4">
  <label className="block text-sm text-foreground mb-2">Full Name</label>
  <input
    type="text"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    className="w-full px-3 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-sm text-foreground mb-2">Email</label>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-3 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
    required
  />
</div>
            <div className="mb-4">
              <label className="block text-sm text-foreground mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>
            <div className="mb-6">
  <label className="block text-sm text-foreground mb-2">Confirm Password</label>
  <input
    type="password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full px-3 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
    required
  />
</div>
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
              Sign Up
            </button>
          </form>
          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:text-blue-600">
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
