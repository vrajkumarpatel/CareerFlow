import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { DocumentUpload } from "../components/document-upload";
import { AIDocumentHelper } from "../components/ai-document-helper";
import { DocumentStorageInfo } from "../components/document-storage-info";
import { saveDocument, getDocument, deleteDocument } from "../utils/file-storage";
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
  TrendingUp,
  Eye
} from "lucide-react";

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<"overview" | "documents">("overview");
  const [resumeFile, setResumeFile] = useState<{ name: string; uploadDate: string } | undefined>(undefined);
  const [coverLetterFile, setCoverLetterFile] = useState<{ name: string; uploadDate: string } | undefined>(undefined);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);

  // Load documents and saved jobs from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Load documents
        const resume = await getDocument('resume');
        if (resume) {
          setResumeFile({ name: resume.name, uploadDate: resume.uploadDate });
        }

        const coverLetter = await getDocument('cover-letter');
        if (coverLetter) {
          setCoverLetterFile({ name: coverLetter.name, uploadDate: coverLetter.uploadDate });
        }

        // Load saved jobs
        const response = await apiClient.get("/saved-jobs/", { headers: { Authorization: `Bearer ${token}` } });
        setSavedJobs(response.data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const applications = [
    {
      id: "1",
      title: "Backend Engineer",
      company: "DataFlow Systems",
      location: "Remote",
      appliedDate: "Feb 15, 2026",
      status: "Under Review",
      statusType: "pending" as const,
    },
    {
      id: "2",
      title: "UX Researcher",
      company: "UserFirst Inc.",
      location: "Remote",
      appliedDate: "Feb 10, 2026",
      status: "Interview Scheduled",
      statusType: "success" as const,
    },
    {
      id: "3",
      title: "Marketing Manager",
      company: "GrowthLabs",
      location: "Austin, TX",
      appliedDate: "Feb 5, 2026",
      status: "Not Selected",
      statusType: "rejected" as const,
    },
  ];

  

  const handleResumeUpload = async (file: File) => {
    try {
      const metadata = await saveDocument(file, 'resume');
      setResumeFile(metadata);
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume');
    }
  };

  const handleCoverLetterUpload = async (file: File) => {
    try {
      const metadata = await saveDocument(file, 'cover-letter');
      setCoverLetterFile(metadata);
    } catch (error) {
      console.error('Error saving cover letter:', error);
      alert('Failed to save cover letter');
    }
  };

  const handleResumeDelete = async () => {
    try {
      await deleteDocument('resume');
      setResumeFile(undefined);
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume');
    }
  };

  const handleCoverLetterDelete = async () => {
    try {
      await deleteDocument('cover-letter');
      setCoverLetterFile(undefined);
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      alert('Failed to delete cover letter');
    }
  };

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
                    <h3 className="font-semibold text-foreground">John Doe</h3>
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
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <Bookmark className="w-5 h-5" />
                    <span>Saved Jobs</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <FileText className="w-5 h-5" />
                    <span>Applications</span>
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
                      <span className="text-sm text-muted-foreground">New Jobs</span>
                      <span className="font-semibold text-foreground">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Applications</span>
                      <span className="font-semibold text-foreground">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Responses</span>
                      <span className="font-semibold text-foreground">1</span>
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
                      <Link to="#" className="text-primary hover:text-blue-700 text-sm transition-colors">
                        View All
                      </Link>
                    </div>

                    {applications.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No applications yet</p>
                        <Link
                          to="/jobs"
                          className="inline-block mt-4 text-primary hover:text-blue-700 transition-colors"
                        >
                          Start applying to jobs
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {applications.map((app) => (
                          <div
                            key={app.id}
                            className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{app.title}</h3>
                                <span
                                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                    app.statusType === "success"
                                      ? "bg-green-100 text-green-700"
                                      : app.statusType === "rejected"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {app.statusType === "success" && <CheckCircle2 className="w-3 h-3" />}
                                  {app.statusType === "rejected" && <XCircle className="w-3 h-3" />}
                                  {app.statusType === "pending" && <Clock className="w-3 h-3" />}
                                  {app.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{app.company}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {app.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Applied {app.appliedDate}
                                </span>
                              </div>
                            </div>
                            <Link
                              to={`/jobs/${app.id}`}
                              className="text-primary hover:text-blue-700 text-sm transition-colors"
                            >
                              View
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeSection === "documents" && (
                <>
                  {/* Storage Info Banner */}
                  <DocumentStorageInfo />

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