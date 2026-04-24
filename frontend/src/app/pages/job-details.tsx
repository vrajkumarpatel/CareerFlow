import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { MapPin, Briefcase, Clock, DollarSign, Building2, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "../../api/client";

export function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const response = await apiClient.get(`/jobs/${id}/`);
      setJob(response.data);
    };
    fetchJob();

    const token = localStorage.getItem("token");
    if (token) {
      apiClient.get("/applications/").then((res) => {
        const results = res.data?.results ?? res.data;
        if (Array.isArray(results)) {
          setApplied(results.some((a: any) => String(a.job_posting.id) === id));
        }
      }).catch(() => {});
    }
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setApplying(true);
    try {
      await apiClient.post("/applications/", { job_posting_id: Number(id) });
      setApplied(true);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setApplied(true);
      }
    } finally {
      setApplying(false);
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 w-full flex-1">
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-primary hover:text-blue-700 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to listings
        </Link>

        {/* Job Header Card */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
            <div className="flex items-center gap-2 text-xl text-muted-foreground">
              <Building2 className="w-5 h-5" />
              {job.company.name}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Location</div>
                <div className="text-sm text-foreground">{job.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Job Type</div>
                <div className="text-sm text-foreground">{job.job_type}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Salary</div>
                <div className="text-sm text-foreground">{job.salary || "Not specified"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Posted</div>
                <div className="text-sm text-foreground">{new Date(job.posted_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {applied ? (
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-lg font-medium">
              <CheckCircle2 className="w-5 h-5" />
              Applied
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={applying}
              className="w-full md:w-auto bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              <Send className="w-5 h-5" />
              {applying ? "Applying..." : "Apply Now"}
            </button>
          )}
        </div>

        {/* Job Description */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Job Description</h2>
          <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {job.description}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Requirements</h2>
          <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {job.requirements}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
