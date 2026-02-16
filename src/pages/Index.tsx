import { useNavigate } from "react-router-dom";
import { STEPS, getHighestUnlockedStep, getCompletedStepsCount } from "@/lib/steps";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const highestUnlocked = getHighestUnlockedStep();
  const completed = getCompletedStepsCount();
  const currentStep = highestUnlocked <= 8 ? STEPS[highestUnlocked - 1] : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-lg px-6">
        <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6">
          <Rocket className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          AI Resume Builder
        </h1>
        <p className="text-sm text-muted-foreground mb-1">KodNest Premium Build System — Project 3</p>
        <p className="text-xs text-muted-foreground mb-8">
          {completed === 0
            ? "8 steps to build your AI-powered resume builder from scratch."
            : `${completed}/8 steps completed. Keep going!`}
        </p>
        <Button
          onClick={() =>
            navigate(currentStep ? `/rb/${currentStep.slug}` : "/rb/proof")
          }
          size="lg"
          className="gap-2"
        >
          {completed === 0 ? "Start Building" : completed === 8 ? "View Proof" : "Continue"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
