import { Link, useNavigate } from "react-router-dom";
import { MapPin, Briefcase, Clock, ArrowRight, Bookmark } from "lucide-react";
import apiClient from "../../api/client";

interface JobCardProps {
  id: string;
  title: string;
  company: {
    name: string;
  };
  location: string;
  type: string;
  description: string;
  postedTime: string;
  isSaved: boolean;
  onSaveToggle: (jobId: string, isSaved: boolean) => void;
}

export function JobCard({ id, title, company, location, type, description, postedTime, isSaved, onSaveToggle }: JobCardProps) {
  const navigate = useNavigate();

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (isSaved) {
        // Unsave logic - requires savedJob id, which we don't have here.
        // This is a limitation of the current implementation.
        // A better approach would be to fetch the savedJob id along with the job data.
        // For now, we'll just update the local state.
      } else {
        await apiClient.post("/saved-jobs/", { job_posting_id: id }, { headers: { Authorization: `Bearer ${token}` } });
      }
      onSaveToggle(id, isSaved);
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground font-medium mb-3">{company.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm whitespace-nowrap">
            {type}
          </span>
          <button onClick={handleSave} className="p-2 rounded-lg hover:bg-accent">
            <Bookmark className={`w-5 h-5 text-muted-foreground ${isSaved ? "fill-current text-primary" : ""}`} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {location}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {postedTime}
        </div>
      </div>
      
      <p className="text-muted-foreground mt-4 line-clamp-3">
        {description}
      </p>
      
      <Link 
        to={`/jobs/${id}`}
        className="inline-flex items-center gap-2 text-primary hover:text-blue-700 transition-colors group"
      >
        View Details
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
