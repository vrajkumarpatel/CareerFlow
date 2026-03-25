import { Link } from "react-router";
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-primary to-blue-600 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-xl text-foreground">CareerFlow</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your trusted partner in finding the perfect career opportunity.
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 text-foreground">Job Seekers</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-muted-foreground hover:text-primary text-sm transition-colors">Browse Jobs</Link></li>
              <li><Link to="/signup" className="text-muted-foreground hover:text-primary text-sm transition-colors">Create Account</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary text-sm transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-foreground">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} CareerFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
