import { useState } from "react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { CompanyManager } from "../components/company-manager";
import { JobManager } from "../components/job-manager";

export function Admin() {
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8">Admin Dashboard</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CompanyManager />
            <JobManager />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
