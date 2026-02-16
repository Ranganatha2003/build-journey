import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PremiumLayout from "@/components/PremiumLayout";
import BuildPanel from "@/components/BuildPanel";
import { STEPS, StepConfig, getHighestUnlockedStep } from "@/lib/steps";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, FileText } from "lucide-react";

interface StepPageProps {
  step: StepConfig;
}

export default function StepPage({ step }: StepPageProps) {
  const navigate = useNavigate();
  const [, setRefresh] = useState(0);

  const forceRefresh = useCallback(() => setRefresh((n) => n + 1), []);

  const highestUnlocked = getHighestUnlockedStep();
  const canProceed = step.number < highestUnlocked;
  const isLast = step.number === 8;
  const isDone = step.number < highestUnlocked;

  const handleNext = () => {
    if (isLast) {
      navigate("/rb/proof");
    } else {
      const next = STEPS.find((s) => s.number === step.number + 1);
      if (next) navigate(`/rb/${next.slug}`);
    }
  };

  const handlePrev = () => {
    const prev = STEPS.find((s) => s.number === step.number - 1);
    if (prev) navigate(`/rb/${prev.slug}`);
  };

  return (
    <PremiumLayout
      stepNumber={step.number}
      buildPanel={
        <BuildPanel
          prompt={step.prompt}
          stepNumber={step.number}
          onArtifactSaved={forceRefresh}
        />
      }
    >
      <div className="max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
              isDone ? "bg-kn-step-done text-primary-foreground" : "bg-primary text-primary-foreground"
            }`}>
              {step.number}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{step.title}</h1>
              <p className="text-sm text-muted-foreground">Step {step.number} of 8</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h2 className="font-semibold text-foreground mb-2">What to do</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <h2 className="font-semibold text-foreground mb-3">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Read the step description above carefully.</li>
            <li>Copy the prompt from the Build Panel on the right.</li>
            <li>Open Lovable and paste the prompt to generate artifacts.</li>
            <li>Review the output and click "It Worked" or "Error".</li>
            <li>Optionally add a screenshot for your records.</li>
            <li>Proceed to the next step when ready.</li>
          </ol>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={step.number === 1} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!canProceed} className="gap-2">
            {isLast ? "Go to Proof" : "Next Step"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {!canProceed && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Complete this step by marking "It Worked" or "Error" in the Build Panel to unlock the next step.
          </p>
        )}
      </div>
    </PremiumLayout>
  );
}
