import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { STEPS, getHighestUnlockedStep, getCompletedStepsCount, isStepAccessible } from "@/lib/steps";
import { Check, Lock, Circle } from "lucide-react";

interface PremiumLayoutProps {
  children: ReactNode;
  buildPanel: ReactNode;
  stepNumber?: number;
}

export default function PremiumLayout({ children, buildPanel, stepNumber }: PremiumLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const completed = getCompletedStepsCount();
  const isProof = location.pathname === "/rb/proof";

  const statusLabel = completed === 8 ? "Complete" : "In Progress";
  const statusColor = completed === 8 ? "bg-kn-badge-complete" : "bg-kn-badge-progress";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Bar */}
      <header className="kn-topbar h-14 flex items-center justify-between px-6 shrink-0 border-b border-border/20">
        <span className="font-bold text-sm tracking-wide uppercase">AI Resume Builder</span>
        <span className="text-sm font-medium opacity-80">
          {isProof ? "Proof of Completion" : stepNumber ? `Project 3 — Step ${stepNumber} of 8` : ""}
        </span>
        <span className={`${statusColor} text-foreground text-xs font-semibold px-3 py-1 rounded-full`}>
          {statusLabel}
        </span>
      </header>

      {/* Step Rail */}
      <nav className="kn-topbar border-b border-border/20 px-6 py-2 flex items-center gap-1 overflow-x-auto shrink-0">
        {STEPS.map((step) => {
          const accessible = isStepAccessible(step.number);
          const isCurrent = stepNumber === step.number;
          const isDone = accessible && step.number < getHighestUnlockedStep();

          return (
            <button
              key={step.number}
              onClick={() => accessible && navigate(`/rb/${step.slug}`)}
              disabled={!accessible}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap
                ${isCurrent ? "bg-kn-step-active text-primary-foreground animate-pulse-glow" : ""}
                ${isDone ? "text-kn-step-done hover:bg-kn-step-done/10" : ""}
                ${!accessible ? "text-kn-step-locked cursor-not-allowed opacity-50" : ""}
                ${accessible && !isCurrent && !isDone ? "hover:bg-muted/20 text-kn-topbar-fg" : ""}
              `}
            >
              {isDone ? (
                <Check className="w-3.5 h-3.5" />
              ) : !accessible ? (
                <Lock className="w-3 h-3" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
              <span className="hidden sm:inline">{step.title}</span>
              <span className="sm:hidden">{step.number}</span>
            </button>
          );
        })}
        <button
          onClick={() => navigate("/rb/proof")}
          className={`ml-auto px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap
            ${isProof ? "bg-kn-step-active text-primary-foreground" : "text-kn-topbar-fg hover:bg-muted/20"}
          `}
        >
          Proof
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Workspace - 70% */}
        <main className="w-[70%] overflow-y-auto p-6 border-r border-border">
          {children}
        </main>

        {/* Build Panel - 30% */}
        <aside className="w-[30%] overflow-y-auto p-4 kn-panel border-l border-kn-panel-border">
          {buildPanel}
        </aside>
      </div>

      {/* Proof Footer */}
      <footer className="kn-footer h-10 flex items-center justify-between px-6 text-xs shrink-0 border-t border-border/20">
        <span>KodNest Premium Build System</span>
        <span>{completed}/8 Steps Complete</span>
      </footer>
    </div>
  );
}
