import { useState, useEffect } from "react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { JobCard } from "../components/job-card";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import apiClient from "../../api/client";

export function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          search: searchQuery,
          location: selectedLocation === "all" ? "" : selectedLocation,
          job_type: selectedType === "all" ? "" : selectedType,
          experience: selectedExperience === "all" ? "" : selectedExperience,
        };
        const response = await apiClient.get("/jobs/", { params });
        setJobs(response.data.results);
        setTotalPages(Math.ceil(response.data.count / itemsPerPage));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedJobs = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const savedJobsResponse = await apiClient.get("/saved-jobs/", { headers: { Authorization: `Bearer ${token}` } });
          const savedIds = new Set(savedJobsResponse.data.map((job: any) => job.job_posting.id));
          setSavedJobIds(savedIds);
        } catch (err) {
          console.error("Failed to fetch saved jobs", err);
        }
      }
    };

    fetchJobs();
    fetchSavedJobs();
  }, [currentPage, searchQuery, selectedLocation, selectedType, selectedExperience]);

  const handleSaveToggle = (jobId: string, isSaved: boolean) => {
    if (isSaved) {
      const newSavedIds = new Set(savedJobIds);
      newSavedIds.delete(jobId);
      setSavedJobIds(newSavedIds);
    } else {
      const newSavedIds = new Set(savedJobIds);
      newSavedIds.add(jobId);
      setSavedJobIds(newSavedIds);
    }
  };
  const paginatedJobs = jobs;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 w-full flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Find Your Perfect Job</h1>
          <p className="text-muted-foreground">
            Browse through {jobs.length} open positions
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm text-foreground mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="all">All Locations</option>
                    <option value="San Francisco">San Francisco, CA</option>
                    <option value="New York">New York, NY</option>
                    <option value="Remote">Remote</option>
                    <option value="Austin">Austin, TX</option>
                    <option value="Seattle">Seattle, WA</option>
                    <option value="Boston">Boston, MA</option>
                    <option value="Chicago">Chicago, IL</option>
                  </select>
                </div>

                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm text-foreground mb-2">Job Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="all">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="block text-sm text-foreground mb-2">Experience Level</label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full px-3 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="all">All Levels</option>
                    <option value="Entry-level">Entry Level</option>
                    <option value="Mid-level">Mid Level</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSelectedLocation("all");
                    setSelectedType("all");
                    setSelectedExperience("all");
                    setSearchQuery("");
                  }}
                  className="w-full px-4 py-2 text-primary hover:bg-accent rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {paginatedJobs.length} of {jobs.length} jobs
            </div>
            
            <div className="grid grid-cols-1 gap-6 mb-8">
              {paginatedJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  {...job} 
                  isSaved={savedJobIds.has(job.id)}
                  onSaveToggle={handleSaveToggle}
                />
              ))}
            </div>

            {jobs.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No jobs found matching your criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "border border-border hover:bg-accent"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}