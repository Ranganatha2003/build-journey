import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PremiumLayout from "@/components/PremiumLayout";
import { STEPS, getCompletedStepsCount } from "@/lib/steps";
import { Check, X, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function ProofPage() {
  const navigate = useNavigate();
  const [lovableLink, setLovableLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [deployLink, setDeployLink] = useState("");
  const completed = getCompletedStepsCount();

  const handleCopySubmission = () => {
    const submission = `
=== AI Resume Builder — Final Submission ===
Project: AI Resume Builder (Project 3)
Completed Steps: ${completed}/8

Steps Status:
${STEPS.map((s) => {
  const artifact = localStorage.getItem(s.artifactKey);
  const status = artifact ? JSON.parse(artifact).status : "incomplete";
  return `  Step ${s.number} (${s.title}): ${status === "success" ? "✅ Done" : status === "error" ? "⚠️ Error" : "❌ Incomplete"}`;
}).join("\n")}

Links:
  Lovable: ${lovableLink || "Not provided"}
  GitHub: ${githubLink || "Not provided"}
  Deploy: ${deployLink || "Not provided"}

Submitted: ${new Date().toISOString()}
===
    `.trim();

    navigator.clipboard.writeText(submission);
    toast({ title: "Submission Copied!", description: "Paste this in your submission form." });
  };

  return (
    <PremiumLayout
      buildPanel={
        <div className="flex flex-col gap-4 h-full">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Submission Panel</h3>
          <p className="text-xs text-muted-foreground">
            Fill in your project links and copy the final submission.
          </p>

          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Lovable Project Link</label>
              <Input
                placeholder="https://lovable.dev/projects/..."
                value={lovableLink}
                onChange={(e) => setLovableLink(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">GitHub Repository Link</label>
              <Input
                placeholder="https://github.com/..."
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Deploy / Live Link</label>
              <Input
                placeholder="https://your-app.lovable.app"
                value={deployLink}
                onChange={(e) => setDeployLink(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleCopySubmission} className="w-full gap-2 mt-4">
            <Copy className="w-4 h-4" />
            Copy Final Submission
          </Button>
        </div>
      }
    >
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Proof of Completion</h1>
          <p className="text-sm text-muted-foreground">
            Review your progress across all 8 steps. Complete all steps and submit your project links.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Overall Progress</h2>
            <span className={`text-sm font-bold ${completed === 8 ? "text-kn-step-done" : "text-kn-badge-progress"}`}>
              {completed}/8 Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-kn-step-done rounded-full transition-all duration-500"
              style={{ width: `${(completed / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Status Grid */}
        <div className="space-y-3 mb-6">
          {STEPS.map((step) => {
            const raw = localStorage.getItem(step.artifactKey);
            const artifact = raw ? JSON.parse(raw) : null;
            const status = artifact?.status;

            return (
              <div
                key={step.number}
                className="flex items-center justify-between bg-card rounded-lg border border-border p-4 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/rb/${step.slug}`)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${
                    status === "success"
                      ? "bg-kn-step-done text-primary-foreground"
                      : status === "error"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {status === "success" ? <Check className="w-4 h-4" /> : status === "error" ? <X className="w-4 h-4" /> : step.number}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">Step {step.number}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  status === "success"
                    ? "bg-kn-step-done/10 text-kn-step-done"
                    : status === "error"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {status === "success" ? "Done" : status === "error" ? "Error" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </PremiumLayout>
  );
}
