export interface StepConfig {
  number: number;
  slug: string;
  title: string;
  description: string;
  artifactKey: string;
  prompt: string;
}

export const STEPS: StepConfig[] = [
  {
    number: 1,
    slug: "01-problem",
    title: "Problem Statement",
    description: "Define the core problem your AI Resume Builder solves. Identify the target user, their pain points, and why existing solutions fall short.",
    artifactKey: "rb_step_1_artifact",
    prompt: `You are building Step 1 of the AI Resume Builder project.

Define the Problem Statement:
- Who is the target user?
- What specific pain point does this solve?
- Why do existing solutions fail?
- What is the core value proposition?

Create a clear, concise problem statement document.`,
  },
  {
    number: 2,
    slug: "02-market",
    title: "Market Research",
    description: "Analyze the competitive landscape. Identify key competitors, market size, and your unique differentiator in the AI resume space.",
    artifactKey: "rb_step_2_artifact",
    prompt: `You are building Step 2 of the AI Resume Builder project.

Conduct Market Research:
- List top 5 competitors in AI resume building
- Identify market size and growth trends
- Define your unique selling proposition (USP)
- Map competitive advantages

Create a market research summary document.`,
  },
  {
    number: 3,
    slug: "03-architecture",
    title: "System Architecture",
    description: "Design the overall system architecture. Define the tech stack, data flow, and integration points for the AI Resume Builder.",
    artifactKey: "rb_step_3_artifact",
    prompt: `You are building Step 3 of the AI Resume Builder project.

Design System Architecture:
- Define the tech stack (frontend, backend, AI/ML)
- Map the data flow from user input to resume output
- Identify external API integrations
- Define the deployment architecture

Create a system architecture document with diagrams.`,
  },
  {
    number: 4,
    slug: "04-hld",
    title: "High-Level Design",
    description: "Create the high-level design document. Define modules, APIs, database schema, and component interactions.",
    artifactKey: "rb_step_4_artifact",
    prompt: `You are building Step 4 of the AI Resume Builder project.

Create High-Level Design:
- Define major modules and their responsibilities
- Design API endpoints and contracts
- Create database schema overview
- Map component interaction diagrams

Create an HLD document.`,
  },
  {
    number: 5,
    slug: "05-lld",
    title: "Low-Level Design",
    description: "Detail the low-level design. Define class structures, algorithms, data models, and implementation specifics.",
    artifactKey: "rb_step_5_artifact",
    prompt: `You are building Step 5 of the AI Resume Builder project.

Create Low-Level Design:
- Define class/component structures
- Detail algorithms for AI resume generation
- Specify data models and validation rules
- Write pseudocode for core functions

Create an LLD document.`,
  },
  {
    number: 6,
    slug: "06-build",
    title: "Build Phase",
    description: "Implement the AI Resume Builder. Use the prompts to build each feature incrementally in Lovable.",
    artifactKey: "rb_step_6_artifact",
    prompt: `You are building Step 6 of the AI Resume Builder project.

Build Phase - Implementation:
- Set up the project structure
- Implement core UI components
- Build the resume form and preview
- Integrate AI-powered content suggestions

Paste this prompt into Lovable to start building.`,
  },
  {
    number: 7,
    slug: "07-test",
    title: "Testing",
    description: "Test the AI Resume Builder thoroughly. Verify all features, edge cases, and user flows work correctly.",
    artifactKey: "rb_step_7_artifact",
    prompt: `You are building Step 7 of the AI Resume Builder project.

Testing Phase:
- Test all user input forms and validation
- Verify AI content generation quality
- Test resume export (PDF, DOCX)
- Check responsive design on mobile/tablet
- Test edge cases and error handling

Document test results and screenshots.`,
  },
  {
    number: 8,
    slug: "08-ship",
    title: "Ship & Deploy",
    description: "Deploy the AI Resume Builder to production. Set up hosting, domain, and monitor the launch.",
    artifactKey: "rb_step_8_artifact",
    prompt: `You are building Step 8 of the AI Resume Builder project.

Ship & Deploy:
- Deploy to production (Lovable publish)
- Set up custom domain (optional)
- Configure analytics and monitoring
- Create launch documentation
- Share deployment links

Document your deployment process and live URLs.`,
  },
];

export function getStepStatus(stepNumber: number): "done" | "active" | "locked" {
  for (let i = 1; i <= 8; i++) {
    const artifact = localStorage.getItem(`rb_step_${i}_artifact`);
    if (!artifact) {
      if (i === stepNumber) return "active";
      if (i < stepNumber) return "locked"; // shouldn't happen if gating works
      return "locked";
    }
    if (i === stepNumber) return "done";
  }
  return "done";
}

export function getHighestUnlockedStep(): number {
  for (let i = 1; i <= 8; i++) {
    const artifact = localStorage.getItem(`rb_step_${i}_artifact`);
    if (!artifact) return i;
  }
  return 9; // all done
}

export function isStepAccessible(stepNumber: number): boolean {
  return stepNumber <= getHighestUnlockedStep();
}

export function getCompletedStepsCount(): number {
  let count = 0;
  for (let i = 1; i <= 8; i++) {
    if (localStorage.getItem(`rb_step_${i}_artifact`)) count++;
  }
  return count;
}
