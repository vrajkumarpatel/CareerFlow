import { Link, useNavigate } from "react-router-dom";
import { Briefcase, LayoutDashboard, Search, Shield } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  is_staff: boolean;
}

export function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let is_staff = false;

  if (token) {
    const decodedToken = jwtDecode<DecodedToken>(token);
    is_staff = decodedToken.is_staff;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-primary to-blue-600 p-2 rounded-lg transition-transform group-hover:scale-105">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl text-foreground">CareerFlow</span>
          </Link>
          
          {/* Main Navigation & Auth */}
          <div className="flex items-center gap-6">
            {/* Main Nav Links */}
            <div className="flex items-center gap-1">
              <Link 
                to="/jobs" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-accent transition-all"
              >
                <Search className="w-4 h-4" />
                <span className="font-medium">Browse Jobs</span>
              </Link>
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-accent transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="font-medium">Dashboard</span>
              </Link>
              {is_staff && (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-accent transition-all"
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-border"></div>
            
            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {token ? (
                <button 
                  onClick={handleLogout} 
                  className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-lg font-medium text-foreground hover:text-primary hover:bg-accent transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}