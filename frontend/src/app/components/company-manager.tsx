import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Building, ExternalLink, X } from "lucide-react";
import apiClient from "../../api/client";

interface Company {
  id: number;
  name: string;
  description: string;
  website: string;
}

const empty = { name: "", description: "", website: "" };

export function CompanyManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCompanies = async () => {
    setFetchError("");
    try {
      const res = await apiClient.get("/companies/", { params: { page_size: 100 } });
      const results = res.data?.results ?? res.data;
      setCompanies(Array.isArray(results) ? results : []);
      setTotalCount(res.data?.count ?? (Array.isArray(results) ? results.length : 0));
    } catch (e: any) {
      setFetchError(e.response?.status === 403 ? "Access denied. Admin privileges required." : "Failed to load companies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (c: Company) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description, website: c.website });
    setError("");
    setDialogOpen(true);
  };

  const closeDialog = () => { setDialogOpen(false); setEditing(null); setForm(empty); setError(""); };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Company name is required."); return; }
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await apiClient.put(`/companies/${editing.id}/`, form);
      } else {
        await apiClient.post("/companies/", form);
      }
      await fetchCompanies();
      closeDialog();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this company? All associated jobs may be affected.")) return;
    try {
      await apiClient.delete(`/companies/${id}/`);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Failed to delete company.");
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Companies</h2>
          <p className="text-sm text-muted-foreground mt-1">{loading ? "Loading..." : `${totalCount} total companies`}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading companies...</div>
      ) : fetchError ? (
        <div className="text-center py-12 text-red-600 bg-red-50 rounded-lg">{fetchError}</div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12">
          <Building className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No companies yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Company</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Description</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Website</th>
                <th className="py-3 px-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Building className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-foreground">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell max-w-xs truncate">
                    {c.description || <span className="italic text-muted-foreground/50">—</span>}
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                        {c.website.replace(/^https?:\/\//, "")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-muted-foreground/50 italic">—</span>}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
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
          <div className="bg-card rounded-xl shadow-xl border border-border w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground text-lg">{editing ? "Edit Company" : "Add Company"}</h3>
              <button onClick={closeDialog} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Company Name <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief company description..."
                  rows={3}
                  className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Website</label>
                <input
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={closeDialog} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Company"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
