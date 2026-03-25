import { useState } from "react";
import { Sparkles, FileText, CheckCircle2, AlertCircle, Lightbulb, Loader2 } from "lucide-react";

interface AIDocumentHelperProps {
  documentType: "resume" | "cover-letter";
  hasDocument: boolean;
}

export function AIDocumentHelper({ documentType, hasDocument }: AIDocumentHelperProps) {
  const [activeTab, setActiveTab] = useState<"review" | "generate">("review");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  const handleReview = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationComplete(false);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationComplete(true);
    }, 4000);
  };

  const displayName = documentType === "resume" ? "Resume" : "Cover Letter";

  // Mock analysis results
  const analysisResults = {
    score: 85,
    strengths: [
      "Clear and concise summary section",
      "Quantifiable achievements highlighted",
      "Relevant technical skills listed",
      "Professional formatting and structure",
    ],
    improvements: [
      "Add more action verbs to describe your responsibilities",
      "Include specific metrics for project outcomes",
      "Tailor keywords to match job descriptions",
      "Consider adding a certification section",
    ],
    suggestions: [
      "Optimize for ATS (Applicant Tracking Systems)",
      "Update contact information format",
      "Add LinkedIn profile URL",
    ],
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">AI Assistant</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("review")}
          className={`flex-1 px-4 py-2.5 rounded-lg transition-all ${
            activeTab === "review"
              ? "bg-white shadow-sm text-foreground"
              : "text-muted-foreground hover:bg-white/50"
          }`}
        >
          Review {displayName}
        </button>
        <button
          onClick={() => setActiveTab("generate")}
          className={`flex-1 px-4 py-2.5 rounded-lg transition-all ${
            activeTab === "generate"
              ? "bg-white shadow-sm text-foreground"
              : "text-muted-foreground hover:bg-white/50"
          }`}
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
              <p className="text-muted-foreground mb-4">
                Upload your {displayName.toLowerCase()} first to get AI-powered feedback
              </p>
            </div>
          ) : (
            <>
              {!analysisComplete && !isAnalyzing && (
                <div className="bg-white rounded-lg p-6">
                  <p className="text-muted-foreground mb-4">
                    Get instant feedback on your {displayName.toLowerCase()} with our AI-powered analysis
                  </p>
                  <button
                    onClick={handleReview}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Analyze {displayName}
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="bg-white rounded-lg p-8 text-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="font-medium text-foreground mb-2">Analyzing your {displayName.toLowerCase()}...</p>
                  <p className="text-sm text-muted-foreground">
                    Our AI is reviewing content, structure, and optimization
                  </p>
                </div>
              )}

              {analysisComplete && (
                <div className="space-y-4">
                  {/* Score */}
                  <div className="bg-white rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground">Overall Score</h4>
                      <div className="text-3xl font-bold text-primary">{analysisResults.score}%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${analysisResults.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="bg-white rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-foreground">Strengths</h4>
                    </div>
                    <ul className="space-y-2">
                      {analysisResults.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="bg-white rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <h4 className="font-semibold text-foreground">Areas for Improvement</h4>
                    </div>
                    <ul className="space-y-2">
                      {analysisResults.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-white rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-foreground">Pro Tips</h4>
                    </div>
                    <ul className="space-y-2">
                      {analysisResults.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={handleReview}
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
          {!isGenerating && !generationComplete && (
            <div className="bg-white rounded-lg p-6 space-y-4">
              <p className="text-muted-foreground">
                Let AI create a professional {displayName.toLowerCase()} tailored to your career goals
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Senior Frontend Developer"
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Industry
                  </label>
                  <select className="w-full px-4 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Education</option>
                    <option>Marketing</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Years of Experience
                  </label>
                  <select className="w-full px-4 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                    <option>Entry Level (0-2 years)</option>
                    <option>Mid Level (3-5 years)</option>
                    <option>Senior (6-10 years)</option>
                    <option>Expert (10+ years)</option>
                  </select>
                </div>

                {documentType === "cover-letter" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., TechCorp Inc."
                      className="w-full px-4 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate with AI
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="bg-white rounded-lg p-8 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="font-medium text-foreground mb-2">Generating your {displayName.toLowerCase()}...</p>
              <p className="text-sm text-muted-foreground">
                AI is crafting a professional document based on your input
              </p>
            </div>
          )}

          {generationComplete && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h4 className="font-semibold text-foreground">Document Generated!</h4>
                </div>
                <p className="text-muted-foreground mb-4">
                  Your AI-generated {displayName.toLowerCase()} is ready for download and review.
                </p>
                <div className="flex gap-3">
                  <button className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Download Document
                  </button>
                  <button className="flex-1 bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg hover:bg-accent transition-colors">
                    Preview
                  </button>
                </div>
              </div>

              <button
                onClick={() => setGenerationComplete(false)}
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
