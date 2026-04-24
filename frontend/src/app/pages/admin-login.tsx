import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Lock, User, AlertCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import apiClient from "../../api/client";

interface DecodedToken {
  is_staff: boolean;
}

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/login/", { username, password });
      const token = response.data.access;
      const decoded = jwtDecode<DecodedToken>(token);

      if (!decoded.is_staff) {
        setError("Access denied. This portal is for administrators only.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("refresh", response.data.refresh);
      navigate("/admin");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Top bar */}
      <div className="border-b border-slate-800 px-6 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="bg-gradient-to-br from-primary to-blue-600 p-1.5 rounded-lg">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-slate-300 font-medium text-sm">CareerFlow</span>
          <span className="text-slate-600 text-sm">/</span>
          <span className="text-slate-500 text-sm">Admin Portal</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Restricted access — administrators only</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 bg-red-950/60 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-2.5 rounded-lg font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
              >
                {loading ? "Verifying..." : "Sign in to Admin"}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-600 text-xs mt-6">
            Not an admin?{" "}
            <Link to="/login" className="text-slate-400 hover:text-slate-300 transition-colors">
              Go to regular login
            </Link>
          </p>
        </div>
      </div>

      <div className="text-center py-6 text-slate-700 text-xs">
        CareerFlow Admin Portal — Unauthorized access is prohibited
      </div>
    </div>
  );
}
