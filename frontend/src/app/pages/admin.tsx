import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { CompanyManager } from "../components/company-manager";
import { JobManager } from "../components/job-manager";
import { UserManager } from "../components/user-manager";
import { AdminSidebar } from "../components/admin-sidebar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import {
  CartesianGrid, XAxis, YAxis, Bar, BarChart as RechartsBarChart,
  AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Briefcase, Building, Users, TrendingUp, TrendingDown,
  Bell, CheckCircle2, AlertCircle, Info, Clock,
  ArrowUpRight, Bookmark, Eye,
} from "lucide-react";
import apiClient from "../../api/client";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const jobTypeData = [
  { type: "Full-time", count: 0, fill: "hsl(var(--primary))" },
  { type: "Part-time", count: 0, fill: "#60a5fa" },
  { type: "Contract", count: 0, fill: "#a78bfa" },
  { type: "Remote", count: 0, fill: "#34d399" },
];

const PIE_COLORS = ["hsl(var(--primary))", "#60a5fa", "#a78bfa", "#34d399"];

const notifications = [
  { id: 1, type: "success", icon: CheckCircle2, title: "New user registered", body: "testuser joined CareerFlow", time: "2 min ago" },
  { id: 2, type: "info", icon: Briefcase, title: "New job posted", body: "Senior React Developer at TechCorp", time: "15 min ago" },
  { id: 3, type: "info", icon: Building, title: "New company added", body: "Innovate Labs was added to the platform", time: "1 hr ago" },
  { id: 4, type: "warning", icon: AlertCircle, title: "High traffic detected", body: "Job listings page saw a 3x spike", time: "2 hr ago" },
  { id: 5, type: "info", icon: Bookmark, title: "Job saved", body: "A user bookmarked Backend Engineer at DataFlow", time: "3 hr ago" },
  { id: 6, type: "success", icon: CheckCircle2, title: "New user registered", body: "alice123 joined CareerFlow", time: "5 hr ago" },
  { id: 7, type: "info", icon: Briefcase, title: "New job posted", body: "UX Designer at PixelLab", time: "Yesterday" },
  { id: 8, type: "info", icon: Eye, title: "High job views", body: "Frontend Engineer listing viewed 120 times today", time: "Yesterday" },
];

const notifColor: Record<string, string> = {
  success: "text-green-600 bg-green-50",
  info: "text-blue-600 bg-blue-50",
  warning: "text-yellow-600 bg-yellow-50",
  error: "text-red-600 bg-red-50",
};

export function Admin() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [stats, setStats] = useState({ jobs: 0, companies: 0, users: 0, savedJobs: 0 });
  const [jobTypes, setJobTypes] = useState(jobTypeData);
  const [monthlyData, setMonthlyData] = useState<{ month: string; jobs: number; applications: number; users: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Guard: redirect to admin login if not authenticated as staff
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/admin-login"); return; }
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.is_staff) navigate("/admin-login");
    } catch {
      navigate("/admin-login");
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, companiesRes, usersRes, statsRes] = await Promise.all([
          apiClient.get("/jobs/", { params: { page_size: 100 } }),
          apiClient.get("/companies/"),
          apiClient.get("/users/"),
          apiClient.get("/admin-stats/"),
        ]);
        const totalJobs: number = jobsRes.data?.count ?? 0;
        const totalCompanies: number = companiesRes.data?.count ?? 0;
        const totalUsers: number = usersRes.data?.count ?? 0;
        const allJobs: any[] = jobsRes.data?.results ?? [];

        const typeCounts: Record<string, number> = {};
        allJobs.forEach((j: any) => {
          const t = j.job_type || "Other";
          typeCounts[t] = (typeCounts[t] || 0) + 1;
        });
        setJobTypes(jobTypeData.map((d) => ({ ...d, count: typeCounts[d.type] ?? 0 })));
        setStats({ jobs: totalJobs, companies: totalCompanies, users: totalUsers, savedJobs: 0 });

        // Build monthly chart data from real stats
        const jobsByMonth: Record<string, number> = {};
        const appsByMonth: Record<string, number> = {};
        const usersByMonth: Record<string, number> = {};
        (statsRes.data.jobs || []).forEach((r: any) => { jobsByMonth[r.month] = r.count; });
        (statsRes.data.applications || []).forEach((r: any) => { appsByMonth[r.month] = r.count; });
        (statsRes.data.users || []).forEach((r: any) => { usersByMonth[r.month] = r.count; });
        const allMonths = Array.from(new Set([
          ...Object.keys(jobsByMonth),
          ...Object.keys(appsByMonth),
          ...Object.keys(usersByMonth),
        ])).sort((a, b) => MONTHS.indexOf(a) - MONTHS.indexOf(b));
        setMonthlyData(allMonths.map((m) => ({
          month: m,
          jobs: jobsByMonth[m] ?? 0,
          applications: appsByMonth[m] ?? 0,
          users: usersByMonth[m] ?? 0,
        })));
      } catch (e) {
        console.error("Failed to load admin stats", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const sidebarStats = { jobs: stats.jobs, companies: stats.companies, users: stats.users, notifications: notifications.length };

  const kpiCards = [
    {
      label: "Total Jobs",
      value: stats.jobs,
      icon: Briefcase,
      trend: "+12%",
      up: true,
      color: "from-primary to-blue-600",
    },
    {
      label: "Companies",
      value: stats.companies,
      icon: Building,
      trend: "+5%",
      up: true,
      color: "from-violet-500 to-purple-600",
    },
    {
      label: "Registered Users",
      value: stats.users || "—",
      icon: Users,
      trend: "+23%",
      up: true,
      color: "from-emerald-500 to-green-600",
    },
    {
      label: "Notifications",
      value: notifications.length,
      icon: Bell,
      trend: `${notifications.filter(n => n.type === "warning").length} alerts`,
      up: false,
      color: "from-orange-400 to-amber-500",
    },
  ];

  const areaConfig = {
    jobs: { label: "Jobs Posted", color: "hsl(var(--primary))" },
    applications: { label: "Applications", color: "#60a5fa" },
  };

  const barConfig = {
    count: { label: "Listings", color: "hsl(var(--primary))" },
  };

  const currentMonth = MONTHS[new Date().getMonth()];

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Platform overview as of {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <span className="flex items-center gap-2 text-sm bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              All Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} stats={sidebarStats} />

            <div className="lg:col-span-3 space-y-6">

              {/* ── OVERVIEW ─────────────────────────────────── */}
              {activeSection === "overview" && (
                <>
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiCards.map((card) => (
                      <div key={card.label} className="bg-card rounded-xl border border-border p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}>
                            <card.icon className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-foreground tabular-nums">
                          {loading && typeof card.value === "number" ? "…" : card.value}
                        </p>
                        <p className={`text-xs mt-1 flex items-center gap-1 ${card.up ? "text-green-600" : "text-amber-600"}`}>
                          {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {card.trend} vs last month
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Activity Chart */}
                  <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-lg font-semibold text-foreground">Platform Activity</h2>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">Last 6 months</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">Jobs posted &amp; applications submitted over time</p>
                    <ChartContainer config={areaConfig} className="h-[240px] w-full">
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={30} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="jobs" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorJobs)" dot={{ r: 3 }} />
                        <Area type="monotone" dataKey="applications" stroke="#60a5fa" strokeWidth={2} fill="url(#colorApps)" dot={{ r: 3 }} />
                      </AreaChart>
                    </ChartContainer>
                  </div>

                  {/* Bottom row: Job type bar chart + Recent notifications */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Job type distribution */}
                    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                      <h2 className="text-lg font-semibold text-foreground mb-1">Jobs by Type</h2>
                      <p className="text-sm text-muted-foreground mb-4">Current listing breakdown</p>
                      <ChartContainer config={barConfig} className="h-[200px] w-full">
                        <RechartsBarChart data={jobTypes} layout="vertical" barSize={16}>
                          <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
                          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                          <YAxis type="category" dataKey="type" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={60} />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                          <Bar dataKey="count" radius={4}>
                            {jobTypes.map((entry, index) => (
                              <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ChartContainer>
                    </div>

                    {/* Recent notifications preview */}
                    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                        <button onClick={() => setActiveSection("notifications")} className="text-xs text-primary hover:text-blue-700 transition-colors flex items-center gap-1">
                          View all <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {notifications.slice(0, 4).map((n) => (
                          <div key={n.id} className="flex items-start gap-3">
                            <span className={`p-1.5 rounded-lg ${notifColor[n.type]}`}>
                              <n.icon className="w-3.5 h-3.5" />
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{n.body}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── NOTIFICATIONS ───────────────────────────── */}
              {activeSection === "notifications" && (
                <div className="bg-card rounded-xl border border-border shadow-sm">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                      <p className="text-sm text-muted-foreground">{notifications.length} recent alerts &amp; events</p>
                    </div>
                    <div className="flex gap-2">
                      {["All", "Success", "Info", "Warning"].map((f) => (
                        <span key={f} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground cursor-default">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/50 transition-colors">
                        <span className={`p-2 rounded-lg mt-0.5 ${notifColor[n.type]}`}>
                          <n.icon className="w-4 h-4" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{n.title}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap mt-0.5">
                          <Clock className="w-3 h-3" />
                          {n.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "users" && <UserManager />}
              {activeSection === "companies" && <CompanyManager />}
              {activeSection === "jobs" && <JobManager />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
