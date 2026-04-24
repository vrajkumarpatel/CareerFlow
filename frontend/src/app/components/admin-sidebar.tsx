import { LayoutDashboard, Users, Building, Briefcase, Bell, Shield } from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  stats: { jobs: number; companies: number; users: number; notifications: number };
}

export function AdminSidebar({ activeSection, setActiveSection, stats }: AdminSidebarProps) {
  const navItems = [
    { name: "Overview", icon: LayoutDashboard, section: "overview" },
    { name: "Notifications", icon: Bell, section: "notifications", badge: stats.notifications },
    { name: "Users", icon: Users, section: "users", badge: stats.users },
    { name: "Companies", icon: Building, section: "companies", badge: stats.companies },
    { name: "Jobs", icon: Briefcase, section: "jobs", badge: stats.jobs },
  ];

  return (
    <aside className="lg:col-span-1">
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 sticky top-24">
        {/* Admin profile block */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Administrator</p>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Super Admin</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveSection(item.section)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                activeSection === item.section
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium tabular-nums ${
                  activeSection === item.section
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Platform Health</p>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Uptime</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">API Status</span>
              <span className="flex items-center gap-1.5 font-medium text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Online
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">DB Status</span>
              <span className="flex items-center gap-1.5 font-medium text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Healthy
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
