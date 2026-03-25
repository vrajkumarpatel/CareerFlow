import { Link } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { ImageWithFallback } from "../components/Image/ImageWithFallback";
import { Search, Briefcase, Users, TrendingUp, ArrowRight } from "lucide-react";


export function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm">
                  Join 50,000+ job seekers
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Find Your Next Career Opportunity
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with top companies and discover opportunities that match your skills and aspirations. Your dream job is just a click away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/jobs" 
                  className="bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  Browse Jobs
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-primary px-8 py-4 rounded-lg border-2 border-primary hover:bg-accent transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Create Account
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1769740333462-9a63bfa914bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2UlMjBidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDF8fHx8MTc3MjAxODQ3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_medium=referral"
                alt="Professional team collaboration"
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose CareerFlow?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make job searching simple, efficient, and rewarding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-primary to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Smart Search</h3>
              <p className="text-muted-foreground">
                Advanced filters and AI-powered recommendations help you find the perfect match quickly.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-primary to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Quality Jobs</h3>
              <p className="text-muted-foreground">
                Verified companies and curated job listings ensure you only see legitimate opportunities.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-primary to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Career Growth</h3>
              <p className="text-muted-foreground">
                Track applications, get insights, and advance your career with our comprehensive tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-blue-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">10,000+</div>
              <div className="text-blue-100">Active Job Listings</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">5,000+</div>
              <div className="text-blue-100">Trusted Companies</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">50,000+</div>
              <div className="text-blue-100">Happy Job Seekers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who found their dream job through CareerFlow
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
