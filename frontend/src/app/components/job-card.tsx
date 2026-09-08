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
  job_type: string;
  description: string;
  posted_at: string;
  isSaved: boolean;
  onSaveToggle: (jobId: string, isSaved: boolean) => void;
}

export function JobCard({ id, title, company, location, job_type, description, posted_at, isSaved, onSaveToggle }: JobCardProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault(); 
    onSaveToggle(id, isSaved);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link to={`/jobs/${id}`} className="block">
            <h3 className="text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
          <p className="text-muted-foreground font-medium mb-3">{company.name}</p>
        </div>
        <div className="relative flex items-center gap-2">
          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm whitespace-nowrap">
            {job_type}
          </span>
          <button onClick={handleSaveClick} className="relative z-10 p-2 rounded-lg hover:bg-accent">
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
          {formatDate(posted_at)}
        </div>
      </div>
      
      <p className="text-muted-foreground mt-4 line-clamp-3">
        {description}
      </p>
      
      <div className="mt-6">
        <Link to={`/jobs/${id}`} className="inline-flex items-center gap-2 text-primary hover:text-blue-700 transition-colors group">
          View Details
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
