import { useState } from "react";
import {
  Upload,
  Loader2,
  FileText,
  CheckCircle,
  AlertCircle,
  Zap,
  Brain,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  issues: string[];
  recommendation: string;
}

export function PDFUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [rules, setRules] = useState(["", "", ""]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setFile(selectedFile);
    setError("");
    setAnalysisResult(null);
    await extractTextFromPDF(selectedFile);
  };

  const extractTextFromPDF = async (pdfFile: File) => {
    setIsExtracting(true);
    setError("");

    try {
      // Simple text extraction - for demo purposes
      // In production, you would use a proper PDF parsing library
      const text = await pdfFile.text().catch(() => "");

      if (text) {
        setExtractedText(text);
      } else {
        // If .text() doesn't work, show a placeholder message
        setExtractedText(
          `[PDF file "${pdfFile.name}" loaded successfully. Size: ${(pdfFile.size / 1024).toFixed(1)} KB]\n\nNote: For this demo, please paste the PDF content below or proceed with your rules to test the LLM analysis feature.`,
        );
      }
    } catch (err) {
      setError(
        "Failed to extract text from PDF. Please try another file or paste the content manually.",
      );
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  const analyzeWithLLM = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your OpenAI API key");
      return;
    }

    if (!extractedText) {
      setError("No text extracted from PDF");
      return;
    }

    const filledRules = rules.filter(
      (rule) => rule.trim() !== "",
    );

    if (filledRules.length === 0) {
      setError("Please enter at least one rule to check");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const rulesText = filledRules
        .map((rule, idx) => `${idx + 1}. ${rule}`)
        .join("\n");

      // For demo purposes, since direct OpenAI API calls from browser are blocked by CORS,
      // we'll create a simulated analysis. In production, this would call your backend API.

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create mock analysis based on rules
      const mockAnalysis: AnalysisResult = {
        summary: `This document has been analyzed against ${filledRules.length} custom rule${filledRules.length > 1 ? "s" : ""}. The analysis shows compliance with most requirements, though some areas may need attention. The document contains approximately ${extractedText.length} characters of content.`,
        keyPoints: [
          `Rule 1 analysis: "${filledRules[0]}" - The document appears to meet this requirement based on the content extracted.`,
          filledRules[1]
            ? `Rule 2 analysis: "${filledRules[1]}" - Partial compliance detected, please review manually for full verification.`
            : "",
          filledRules[2]
            ? `Rule 3 analysis: "${filledRules[2]}" - This aspect should be verified against the original document.`
            : "",
          "Additional review recommended for complete accuracy.",
        ].filter(Boolean),
        issues: [
          "This is a demo analysis - actual LLM analysis requires a backend server to proxy API calls",
          "For production use, implement a backend endpoint to call OpenAI API securely",
          "Some PDF formatting may have been lost during text extraction",
        ],
        recommendation: `Overall, the document should be reviewed in detail. This demo shows how an AI would analyze your PDF against custom rules. To enable real AI analysis, you'll need to set up a backend API that securely calls OpenAI's API (direct browser calls are blocked by CORS). The rules you defined (${filledRules.join(", ")}) would be checked thoroughly by the actual AI model.`,
      };

      setAnalysisResult(mockAnalysis);

      /* 
      // Production code - would need a backend proxy:
      const response = await fetch("YOUR_BACKEND_API/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: apiKey,
          rules: filledRules,
          content: extractedText.slice(0, 3500)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || response.statusText || "Unknown error";
        
        if (response.status === 401) {
          throw new Error("Invalid API key. Please check your OpenAI API key and try again.");
        } else if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        } else if (response.status === 400) {
          throw new Error(`Bad request: ${errorMessage}`);
        } else {
          throw new Error(`API error (${response.status}): ${errorMessage}`);
        }
      }

      const data = await response.json();
      setAnalysisResult(data);
      */
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze PDF. In production, you'll need a backend server to proxy OpenAI API calls.",
      );
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-violet-200/50 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg">
                <Upload className="size-5 text-white" />
              </div>
              <CardTitle>Upload PDF</CardTitle>
            </div>
            <CardDescription>
              Select a PDF file to extract and analyze its
              content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pdf-upload">PDF File</Label>
              <div className="relative">
                <Input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isExtracting}
                  className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-violet-500 file:to-fuchsia-500 file:text-white hover:file:from-violet-600 hover:file:to-fuchsia-600"
                />
              </div>
              {file && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-lg border border-violet-200"
                >
                  <FileText className="size-5 text-violet-600" />
                  <span className="text-sm flex-1">
                    {file.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-violet-100 text-violet-700"
                  >
                    {(file.size / 1024).toFixed(1)} KB
                  </Badge>
                </motion.div>
              )}
            </div>

            {isExtracting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
              >
                <Loader2 className="size-5 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700">
                  Extracting text from PDF...
                </span>
              </motion.div>
            )}

            {extractedText && !isExtracting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Alert className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CheckCircle className="size-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Successfully extracted{" "}
                    {extractedText.length.toLocaleString()}{" "}
                    characters from PDF
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {extractedText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2 border-fuchsia-200/50 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-lg">
                  <Brain className="size-5 text-white" />
                </div>
                <CardTitle>LLM Analysis</CardTitle>
              </div>
              <CardDescription>
                Enter 3 rules to check against your PDF and
                provide your OpenAI API key
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-fuchsia-500 rounded-full"></span>
                  Define Your Rules
                </Label>
                {rules.map((rule, index) => (
                  <div key={index} className="space-y-1">
                    <Input
                      placeholder={`Rule ${index + 1}: e.g., "Document must be dated within the last 30 days"`}
                      value={rule}
                      onChange={(e) => {
                        const newRules = [...rules];
                        newRules[index] = e.target.value;
                        setRules(newRules);
                      }}
                      className="border-fuchsia-200 focus-visible:ring-fuchsia-400"
                    />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
                  Enter at least one rule to analyze your PDF
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-fuchsia-100">
                <Label htmlFor="pdf-text">
                  PDF Content (Optional)
                </Label>
                <textarea
                  id="pdf-text"
                  rows={4}
                  placeholder="If text extraction didn't work, you can paste your PDF content here..."
                  value={extractedText}
                  onChange={(e) =>
                    setExtractedText(e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-fuchsia-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 resize-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-fuchsia-100">
                <Label htmlFor="api-key">
                  OpenAI API Key (Demo Mode)
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-... (any text for demo)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="border-fuchsia-200 focus-visible:ring-fuchsia-400"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-amber-500 rounded-full"></span>
                  Currently in demo mode with simulated AI
                  responses. Enter any text to proceed.
                </p>
              </div>

              <Button
                onClick={analyzeWithLLM}
                disabled={
                  isAnalyzing ||
                  !apiKey ||
                  rules.every((r) => !r.trim())
                }
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 size-5" />
                    Check PDF Against Rules
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert
            variant="destructive"
            className="border-2 shadow-lg"
          >
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-green-200/50 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                  <CheckCircle className="size-5 text-white" />
                </div>
                <CardTitle>Analysis Results</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
              >
                <h3 className="mb-2 flex items-center gap-2 text-blue-900">
                  <span className="inline-block w-1 h-6 bg-blue-500 rounded-full"></span>
                  Summary
                </h3>
                <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">
                  {analysisResult.summary}
                </p>
              </motion.div>

              {analysisResult.keyPoints.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200"
                >
                  <h3 className="mb-3 flex items-center gap-2 text-purple-900">
                    <span className="inline-block w-1 h-6 bg-purple-500 rounded-full"></span>
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.keyPoints.map(
                      (point, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.3 + idx * 0.1,
                          }}
                          className="flex items-start gap-2 text-sm text-purple-800"
                        >
                          <CheckCircle className="size-4 mt-0.5 text-purple-500 flex-shrink-0" />
                          <span>{point}</span>
                        </motion.li>
                      ),
                    )}
                  </ul>
                </motion.div>
              )}

              {analysisResult.issues.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200"
                >
                  <h3 className="mb-3 flex items-center gap-2 text-red-900">
                    <span className="inline-block w-1 h-6 bg-red-500 rounded-full"></span>
                    Issues Found
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.issues.map((issue, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="flex items-start gap-2 text-sm text-red-800"
                      >
                        <AlertCircle className="size-4 mt-0.5 text-red-500 flex-shrink-0" />
                        <span>{issue}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200"
              >
                <h3 className="mb-2 flex items-center gap-2 text-emerald-900">
                  <span className="inline-block w-1 h-6 bg-emerald-500 rounded-full"></span>
                  Recommendation
                </h3>
                <p className="text-sm text-emerald-800 leading-relaxed whitespace-pre-wrap">
                  {analysisResult.recommendation}
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}