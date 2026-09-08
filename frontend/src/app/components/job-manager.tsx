import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Briefcase, MapPin, X } from "lucide-react";
import apiClient from "../../api/client";

interface Company { id: number; name: string; }
interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary: string;
  company: Company;
}

const emptyForm = { title: "", description: "", location: "", job_type: "", experience_level: "", salary: "", company_id: "" };

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote"];

export function JobManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    const res = await apiClient.get("/jobs/", { params: { page_size: 100 } });
    const results = res.data?.results ?? res.data;
    setJobs(Array.isArray(results) ? results : []);
    setTotalCount(res.data?.count ?? (Array.isArray(results) ? results.length : 0));
  };

  const fetchCompanies = async () => {
    const res = await apiClient.get("/companies/", { params: { page_size: 100 } });
    const results = res.data?.results ?? res.data;
    setCompanies(Array.isArray(results) ? results : []);
  };

  useEffect(() => {
    Promise.all([fetchJobs(), fetchCompanies()])
      .catch((e: any) => setFetchError(e.response?.status === 403 ? "Access denied. Admin privileges required." : "Failed to load jobs."))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (j: Job) => {
    setEditing(j);
    setForm({ title: j.title, description: j.description, location: j.location, job_type: j.job_type, experience_level: j.experience_level || "", salary: j.salary || "", company_id: String(j.company.id) });
    setError("");
    setDialogOpen(true);
  };

  const closeDialog = () => { setDialogOpen(false); setEditing(null); setForm(emptyForm); setError(""); };

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Job title is required."); return; }
    if (!form.company_id) { setError("Please select a company."); return; }
    if (!form.job_type) { setError("Please select a job type."); return; }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, company_id: Number(form.company_id) };
      if (editing) {
        await apiClient.put(`/jobs/${editing.id}/`, payload);
      } else {
        await apiClient.post("/jobs/", payload);
      }
      await fetchJobs();
      closeDialog();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this job listing?")) return;
    try {
      await apiClient.delete(`/jobs/${id}/`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch {
      alert("Failed to delete job.");
    }
  };

  const typeColor: Record<string, string> = {
    "Full-time": "bg-green-100 text-green-700",
    "Part-time": "bg-blue-100 text-blue-700",
    "Contract": "bg-purple-100 text-purple-700",
    "Remote": "bg-amber-100 text-amber-700",
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Job Listings</h2>
          <p className="text-sm text-muted-foreground mt-1">{loading ? "Loading..." : `${totalCount} total listings`}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Job
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading jobs...</div>
      ) : fetchError ? (
        <div className="text-center py-12 text-red-600 bg-red-50 rounded-lg">{fetchError}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No jobs yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Company</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Location</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                <th className="py-3 px-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-foreground">{j.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{j.company?.name}</td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" />{j.location}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor[j.job_type] ?? "bg-muted text-muted-foreground"}`}>
                      {j.job_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(j)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(j.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl shadow-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card">
              <h3 className="font-semibold text-foreground text-lg">{editing ? "Edit Job" : "Add Job"}</h3>
              <button onClick={closeDialog} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Job Title <span className="text-red-500">*</span></label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Company <span className="text-red-500">*</span></label>
                  <select
                    value={form.company_id}
                    onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="">Select company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Job Type <span className="text-red-500">*</span></label>
                  <select
                    value={form.job_type}
                    onChange={(e) => setForm({ ...form, job_type: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="">Select type</option>
                    {JOB_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. New York, NY or Remote"
                    className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Salary</label>
                  <input
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    placeholder="e.g. $80k–$100k"
                    className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Experience Level</label>
                <select
                  value={form.experience_level}
                  onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="">Any level</option>
                  <option value="Entry-level">Entry Level</option>
                  <option value="Mid-level">Mid Level</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, requirements..."
                  rows={5}
                  className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-card">
              <button onClick={closeDialog} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
