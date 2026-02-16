import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { STEPS, isStepAccessible } from "@/lib/steps";
import StepPage from "@/pages/StepPage";

export default function StepGuard() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  
  const step = STEPS.find((s) => s.slug === slug);

  useEffect(() => {
    if (!step) {
      navigate("/rb/01-problem", { replace: true });
      return;
    }
    if (!isStepAccessible(step.number)) {
      // Find highest accessible step
      const highest = STEPS.find((s) => isStepAccessible(s.number) && !isStepAccessible(s.number + 1)) || STEPS[0];
      navigate(`/rb/${highest.slug}`, { replace: true });
    }
  }, [step, navigate]);

  if (!step || !isStepAccessible(step.number)) return null;

  return <StepPage step={step} />;
}
