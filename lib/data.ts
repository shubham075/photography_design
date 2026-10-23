export type ProjectStatus = "concept" | "in-progress" | "live";

export interface ProjectCaseStudy {
  problem: string;
  solution: string;
  designDirection: string;
  nextStep: string;
}

export interface VerticalTemplate {
  id: string;
  slug: string;
  number: string;
  name: string;
  vertical: string;
  tagline: string;
  description: string;
  heroImage: string;
  mockupImage: string;
  screenshots: string[];
  themeColor: string;
  accentColor: string;
  badge: string;
  projectType: "Concept Template" | "Client Project" | "Design Exploration";
  status: ProjectStatus;
  liveUrl?: string;
  repositoryUrl?: string;
  services: string[];
  techStack: string[];
  features: string[];
  metrics: { label: string; value: string }[];
  caseStudy: ProjectCaseStudy;
  seo: {
    title: string;
    description: string;
  };
}

export const VERTICAL_TEMPLATES: VerticalTemplate[] = [
  {
    id: "photography",
    slug: "photography",
    number: "07",
    name: "Monolith Studio",
    vertical: "Fine Art Photography & Studio",
    tagline: "Capturing the Ineffable.",
    description:
      "A gallery-forward photography concept with full-bleed imagery, series presentation, inquiry routing, and print-order structure.",
    heroImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    mockupImage: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1200&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    ],
    themeColor: "#070709",
    accentColor: "#ffffff",
    badge: "Gallery Concept",
    projectType: "Concept Template",
    status: "concept",
    services: ["Portfolio UX", "Gallery System", "Inquiry Flow", "Visual Direction"],
    techStack: ["Next.js", "GSAP", "Lenis", "Tailwind CSS"],
    features: ["Masonry gallery concept", "Print inquiry route", "Series detail pages", "Image zoom concept"],
    metrics: [
      { label: "Current Stage", value: "Concept" },
      { label: "Primary Goal", value: "Inquiries" },
      { label: "Motion Level", value: "Medium" },
    ],
    caseStudy: {
      problem: "Creative portfolios need immersive presentation while still guiding visitors toward booking or buying.",
      solution: "Build a restrained gallery system where imagery leads and interaction supports discovery.",
      designDirection: "Full-bleed black gallery, minimal chrome, soft parallax, and quiet collector-focused CTAs.",
      nextStep: "Add real photo series, image licensing rules, print SKUs, and inquiry handling.",
    },
    seo: {
      title: "Photography Portfolio Concept | Aethelgard Studio",
      description: "A fine art photography portfolio concept with gallery storytelling and inquiry-focused UX.",
    },
  },
];
