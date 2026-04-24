import { useState } from "react";
import { Sparkles, FileText, CheckCircle2, AlertCircle, Lightbulb, Loader2 } from "lucide-react";
import apiClient from "../../api/client";

interface AIDocumentHelperProps {
  documentType: "resume" | "cover-letter";
  hasDocument: boolean;
}

interface AnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

export function AIDocumentHelper({ documentType, hasDocument }: AIDocumentHelperProps) {
  const [activeTab, setActiveTab] = useState<"review" | "generate">("review");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [generateError, setGenerateError] = useState("");

  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [experience, setExperience] = useState("Mid Level (3-5 years)");
  const [company, setCompany] = useState("");

  const displayName = documentType === "resume" ? "Resume" : "Cover Letter";

  const handleReview = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError("");
    try {
      const res = await apiClient.post("/ai/analyze/", { action: "analyze", doc_type: documentType });
      setAnalysisResult(res.data);
    } catch (err: any) {
      setAnalysisError(err.response?.data?.error || "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedContent("");
    setGenerateError("");
    try {
      const res = await apiClient.post("/ai/analyze/", {
        action: "generate",
        doc_type: documentType,
        job_title: jobTitle,
        industry,
        experience,
        company,
      });
      setGeneratedContent(res.data.content);
    } catch (err: any) {
      setGenerateError(err.response?.data?.error || "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyGenerated = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">AI Assistant</h3>
        <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Powered by Claude</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("review")}
          className={`flex-1 px-4 py-2.5 rounded-lg transition-all ${activeTab === "review" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:bg-white/50"}`}
        >
          Review {displayName}
        </button>
        <button
          onClick={() => setActiveTab("generate")}
          className={`flex-1 px-4 py-2.5 rounded-lg transition-all ${activeTab === "generate" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:bg-white/50"}`}
        >
          Generate {displayName}
        </button>
      </div>

      {/* Review Tab */}
      {activeTab === "review" && (
        <div className="space-y-4">
          {!hasDocument ? (
            <div className="bg-white rounded-lg p-6 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Upload your {displayName.toLowerCase()} first to get AI-powered feedback</p>
            </div>
          ) : (
            <>
              {!analysisResult && !isAnalyzing && (
                <div className="bg-white rounded-lg p-6">
                  {analysisError && (
                    <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">{analysisError}</p>
                  )}
                  <p className="text-muted-foreground mb-4">
                    Get instant AI-powered feedback on your {displayName.toLowerCase()} using Claude
                  </p>
                  <button
                    onClick={handleReview}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" /> Analyze {displayName}
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="bg-white rounded-lg p-8 text-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="font-medium text-foreground mb-2">Claude is analyzing your {displayName.toLowerCase()}...</p>
                  <p className="text-sm text-muted-foreground">Reviewing content, structure, and ATS optimization</p>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground">Overall Score</h4>
                      <div className="text-3xl font-bold text-primary">{analysisResult.score}%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${analysisResult.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-foreground">Strengths</h4>
                    </div>
                    <ul className="space-y-2">
                      {analysisResult.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <h4 className="font-semibold text-foreground">Areas for Improvement</h4>
                    </div>
                    <ul className="space-y-2">
                      {analysisResult.improvements.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-foreground">Pro Tips</h4>
                    </div>
                    <ul className="space-y-2">
                      {analysisResult.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setAnalysisResult(null)}
                    className="w-full bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg hover:bg-accent transition-all flex items-center justify-center gap-2"
                  >
                    Re-analyze {displayName}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Generate Tab */}
      {activeTab === "generate" && (
        <div className="space-y-4">
          {!generatedContent && !isGenerating && (
            <div className="bg-white rounded-lg p-6 space-y-4">
              {generateError && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{generateError}</p>
              )}
              <p className="text-muted-foreground">
                Let Claude create a professional {displayName.toLowerCase()} tailored to your career goals
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Frontend Developer"
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Education</option>
                    <option>Marketing</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Years of Experience</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option>Entry Level (0-2 years)</option>
                    <option>Mid Level (3-5 years)</option>
                    <option>Senior (6-10 years)</option>
                    <option>Expert (10+ years)</option>
                  </select>
                </div>
                {documentType === "cover-letter" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g., TechCorp Inc."
                      className="w-full px-4 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={handleGenerate}
                disabled={!jobTitle.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                <Sparkles className="w-5 h-5" /> Generate with Claude AI
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="bg-white rounded-lg p-8 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="font-medium text-foreground mb-2">Claude is writing your {displayName.toLowerCase()}...</p>
              <p className="text-sm text-muted-foreground">Crafting a professional document based on your details</p>
            </div>
          )}

          {generatedContent && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h4 className="font-semibold text-foreground">{displayName} Generated!</h4>
                  </div>
                  <button
                    onClick={handleCopyGenerated}
                    className="text-xs text-primary hover:text-blue-700 border border-primary px-3 py-1 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto bg-muted p-4 rounded-lg">
                  {generatedContent}
                </pre>
              </div>
              <button
                onClick={() => setGeneratedContent("")}
                className="w-full text-primary hover:text-blue-700 transition-colors"
              >
                Generate Another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
