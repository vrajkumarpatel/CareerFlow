import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { DocumentUpload } from "../components/document-upload";
import { AIDocumentHelper } from "../components/ai-document-helper";
import apiClient from "../../api/client";
import {
  Bookmark,
  FileText,
  User,
  Settings,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Upload,
  Sparkles,
} from "lucide-react";

interface DecodedToken {
  username: string;
  is_staff: boolean;
}

function statusStyle(status: string) {
  if (status === "Interview Scheduled" || status === "Accepted") return "bg-green-100 text-green-700";
  if (status === "Not Selected") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

function statusIcon(status: string) {
  if (status === "Interview Scheduled" || status === "Accepted") return <CheckCircle2 className="w-3 h-3" />;
  if (status === "Not Selected") return <XCircle className="w-3 h-3" />;
  return <Clock className="w-3 h-3" />;
}

function ApplicationRow({ app }: { app: any }) {
  return (
    <div className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-foreground">{app.job_posting.title}</h3>
          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusStyle(app.status)}`}>
            {statusIcon(app.status)}
            {app.status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{app.job_posting.company.name}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{app.job_posting.location}</span>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Applied {new Date(app.applied_at).toLocaleDateString()}</span>
        </div>
      </div>
      <Link to={`/jobs/${app.job_posting.id}`} className="text-primary hover:text-blue-700 text-sm transition-colors">View</Link>
    </div>
  );
}

type DocFile = { name: string; uploadDate: string; url?: string };

export function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<"overview" | "documents" | "saved" | "applications">("overview");
  const [resumeFile, setResumeFile] = useState<DocFile | undefined>(undefined);
  const [coverLetterFile, setCoverLetterFile] = useState<DocFile | undefined>(undefined);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [username, setUsername] = useState("User");
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_api_key') || "");
  const [keySaved, setKeySaved] = useState(false);

  const docToState = (doc: any): DocFile => ({
    name: doc.original_name,
    uploadDate: new Date(doc.uploaded_at).toLocaleDateString(),
    url: doc.file_url,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUsername(decoded.username);
    } catch {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [docsRes, savedRes, appsRes, jobsRes] = await Promise.all([
          apiClient.get("/documents/"),
          apiClient.get("/saved-jobs/"),
          apiClient.get("/applications/"),
          apiClient.get("/jobs/?page_size=1"),
        ]);

        const docs: any[] = Array.isArray(docsRes.data) ? docsRes.data : [];
        const resume = docs.find((d) => d.doc_type === 'resume');
        const cover = docs.find((d) => d.doc_type === 'cover-letter');
        if (resume) setResumeFile(docToState(resume));
        if (cover) setCoverLetterFile(docToState(cover));

        const savedResults = savedRes.data?.results ?? savedRes.data;
        setSavedJobs(Array.isArray(savedResults) ? savedResults : []);

        const appResults = appsRes.data?.results ?? appsRes.data;
        setApplications(Array.isArray(appResults) ? appResults : []);

        setTotalJobs(jobsRes.data?.count ?? 0);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };
    loadData();
  }, []);

  const handleResumeUpload = async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.post('/documents/resume/', form);
    setResumeFile(docToState(res.data));
  };

  const handleCoverLetterUpload = async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.post('/documents/cover-letter/', form);
    setCoverLetterFile(docToState(res.data));
  };

  const handleResumeDelete = async () => {
    await apiClient.delete('/documents/resume/');
    setResumeFile(undefined);
  };

  const handleCoverLetterDelete = async () => {
    await apiClient.delete('/documents/cover-letter/');
    setCoverLetterFile(undefined);
  };

  const responsesCount = applications.filter((a) => a.status !== 'Applied').length;

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Manage your job search and documents.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-sm border border-border p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{username}</h3>
                    <p className="text-sm text-muted-foreground">Job Seeker</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <button 
                    onClick={() => setActiveSection("overview")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      activeSection === "overview"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Overview</span>
                  </button>
                  <button 
                    onClick={() => setActiveSection("documents")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      activeSection === "documents"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    <span>Documents</span>
                    {(!resumeFile || !coverLetterFile) && (
                      <span className="ml-auto bg-primary text-white text-xs px-2 py-0.5 rounded-full">!</span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveSection("saved")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      activeSection === "saved"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Bookmark className="w-5 h-5" />
                    <span>Saved Jobs</span>
                    {savedJobs.length > 0 && (
                      <span className="ml-auto text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{savedJobs.length}</span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveSection("applications")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      activeSection === "applications"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span>Applications</span>
                    {applications.length > 0 && (
                      <span className="ml-auto text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{applications.length}</span>
                    )}
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </button>
                </nav>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">This Week</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Jobs</span>
                      <span className="font-semibold text-foreground">{totalJobs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Applications</span>
                      <span className="font-semibold text-foreground">{applications.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Responses</span>
                      <span className="font-semibold text-foreground">{responsesCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {activeSection === "overview" && (
                <>
                  

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Need help standing out?</h3>
                        <p className="text-blue-100 mb-4">
                          Upload your resume and get AI-powered insights
                        </p>
                        <button
                          onClick={() => setActiveSection("documents")}
                          className="bg-white text-primary px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Try AI Assistant
                        </button>
                      </div>
                      <Sparkles className="w-24 h-24 opacity-20 hidden xl:block" />
                    </div>
                  </div>

                  {/* Saved Jobs */}
                  <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-foreground">Saved Jobs</h2>
                      <Link to="/jobs" className="text-primary hover:text-blue-700 text-sm transition-colors">
                        View All
                      </Link>
                    </div>

                    {savedJobs.length === 0 ? (
                      <div className="text-center py-12">
                        <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No saved jobs yet</p>
                        <Link
                          to="/jobs"
                          className="inline-block mt-4 text-primary hover:text-blue-700 transition-colors"
                        >
                          Browse jobs to get started
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {savedJobs.map((job) => (
                          <div
                            key={job.id}
                            className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                          >
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">{job.job_posting.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{job.job_posting.company.name}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.job_posting.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Saved {new Date(job.saved_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Link
                              to={`/jobs/${job.job_posting.id}`}
                              className="text-primary hover:text-blue-700 text-sm transition-colors"
                            >
                              View
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Applications */}
                  <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-foreground">Recent Applications</h2>
                      <button onClick={() => setActiveSection("applications")} className="text-primary hover:text-blue-700 text-sm transition-colors">
                        View All
                      </button>
                    </div>

                    {applications.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No applications yet</p>
                        <Link to="/jobs" className="inline-block mt-4 text-primary hover:text-blue-700 transition-colors">
                          Start applying to jobs
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {applications.slice(0, 3).map((app) => (
                          <ApplicationRow key={app.id} app={app} />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeSection === "saved" && (
                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Saved Jobs</h2>
                  {savedJobs.length === 0 ? (
                    <div className="text-center py-12">
                      <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No saved jobs yet</p>
                      <Link to="/jobs" className="inline-block mt-4 text-primary hover:text-blue-700 transition-colors">
                        Browse jobs to get started
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedJobs.map((job) => (
                        <div key={job.id} className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{job.job_posting.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{job.job_posting.company.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.job_posting.location}</span>
                              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Saved {new Date(job.saved_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Link to={`/jobs/${job.job_posting.id}`} className="text-primary hover:text-blue-700 text-sm transition-colors">View</Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSection === "applications" && (
                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">My Applications</h2>
                  {applications.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No applications yet</p>
                      <Link to="/jobs" className="inline-block mt-4 text-primary hover:text-blue-700 transition-colors">
                        Start applying to jobs
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <ApplicationRow key={app.id} app={app} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSection === "documents" && (
                <>
                  <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-br from-primary to-blue-600 p-2 rounded-lg">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-foreground">Document Manager</h2>
                        <p className="text-sm text-muted-foreground">
                          Upload and manage your job application documents
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Resume Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">Resume</h3>
                          {resumeFile && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Uploaded
                            </span>
                          )}
                        </div>
                        <DocumentUpload
                          type="resume"
                          onUpload={handleResumeUpload}
                          currentFile={resumeFile}
                          onDelete={handleResumeDelete}
                        />
                      </div>

                      {/* Cover Letter Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">Cover Letter</h3>
                          {coverLetterFile && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Uploaded
                            </span>
                          )}
                        </div>
                        <DocumentUpload
                          type="cover-letter"
                          onUpload={handleCoverLetterUpload}
                          currentFile={coverLetterFile}
                          onDelete={handleCoverLetterDelete}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gemini API Key */}
                  <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">AI Settings</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enter your free Gemini API key to use the AI assistant.{" "}
                      <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        Get a free key →
                      </a>
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={geminiKey}
                        onChange={(e) => { setGeminiKey(e.target.value); setKeySaved(false); }}
                        placeholder="AIzaSy..."
                        className="flex-1 px-3 py-2 bg-muted rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                      <button
                        onClick={() => {
                          localStorage.setItem('gemini_api_key', geminiKey);
                          setKeySaved(true);
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        {keySaved ? "Saved ✓" : "Save"}
                      </button>
                      {geminiKey && (
                        <button
                          onClick={() => {
                            localStorage.removeItem('gemini_api_key');
                            setGeminiKey("");
                            setKeySaved(false);
                          }}
                          className="px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Resume Helper */}
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">AI Resume Assistant</h2>
                    <AIDocumentHelper documentType="resume" hasDocument={!!resumeFile} />
                  </div>

                  {/* AI Cover Letter Helper */}
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">AI Cover Letter Assistant</h2>
                    <AIDocumentHelper documentType="cover-letter" hasDocument={!!coverLetterFile} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}