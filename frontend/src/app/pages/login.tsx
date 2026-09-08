import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import apiClient from "../../api/client";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/auth/login/", { username, password });
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-card rounded-xl shadow-sm border border-border p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-2">Login</h1>
          <p className="text-muted-foreground mb-6">Enter your credentials to access your account.</p>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
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
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
              Login
            </button>
          </form>
          <p className="text-center text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:text-blue-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
