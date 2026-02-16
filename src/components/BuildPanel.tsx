import { useState } from "react";
import { Check, Copy, ExternalLink, AlertCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface BuildPanelProps {
  prompt: string;
  stepNumber: number;
  onArtifactSaved: () => void;
}

export default function BuildPanel({ prompt, stepNumber, onArtifactSaved }: BuildPanelProps) {
  const [copied, setCopied] = useState(false);
  const artifactKey = `rb_step_${stepNumber}_artifact`;
  const existingArtifact = localStorage.getItem(artifactKey);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast({ title: "Copied!", description: "Prompt copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleItWorked = () => {
    const timestamp = new Date().toISOString();
    localStorage.setItem(artifactKey, JSON.stringify({ status: "success", timestamp }));
    toast({ title: "Step Complete! ✅", description: `Step ${stepNumber} marked as done.` });
    onArtifactSaved();
  };

  const handleError = () => {
    const note = window.prompt("Describe the error briefly:");
    if (note) {
      localStorage.setItem(artifactKey, JSON.stringify({ status: "error", note, timestamp: new Date().toISOString() }));
      toast({ title: "Error Logged", description: "Error recorded. You can retry or move on.", variant: "destructive" });
      onArtifactSaved();
    }
  };

  const handleScreenshot = () => {
    const url = window.prompt("Paste screenshot URL or describe what you see:");
    if (url) {
      const existing = localStorage.getItem(artifactKey);
      const data = existing ? JSON.parse(existing) : {};
      data.screenshot = url;
      localStorage.setItem(artifactKey, JSON.stringify(data));
      toast({ title: "Screenshot Added", description: "Screenshot reference saved." });
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Build Panel</h3>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Copy This Into Lovable</label>
        <Textarea
          value={prompt}
          readOnly
          className="min-h-[200px] text-xs font-mono bg-card border-border resize-none"
        />
      </div>

      <Button onClick={handleCopy} variant="default" className="w-full gap-2">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Copied!" : "Copy Prompt"}
      </Button>

      <a
        href="https://lovable.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <ExternalLink className="w-4 h-4" />
        Build in Lovable
      </a>

      <div className="border-t border-border pt-4 mt-auto space-y-2">
        <p className="text-xs font-medium text-muted-foreground mb-2">Mark Result</p>
        
        <Button
          onClick={handleItWorked}
          variant="outline"
          className="w-full gap-2 border-kn-step-done text-kn-step-done hover:bg-kn-step-done/10"
        >
          <Check className="w-4 h-4" />
          It Worked
        </Button>

        <Button
          onClick={handleError}
          variant="outline"
          className="w-full gap-2 border-destructive text-destructive hover:bg-destructive/10"
        >
          <AlertCircle className="w-4 h-4" />
          Error
        </Button>

        <Button
          onClick={handleScreenshot}
          variant="outline"
          className="w-full gap-2"
        >
          <Camera className="w-4 h-4" />
          Add Screenshot
        </Button>
      </div>

      {existingArtifact && (
        <div className="bg-kn-step-done/10 border border-kn-step-done/30 rounded-md p-3 text-xs text-kn-step-done">
          ✅ Artifact saved for this step
        </div>
      )}
    </div>
  );
}
