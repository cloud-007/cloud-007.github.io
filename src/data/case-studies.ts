export interface CaseStudy {
  slug: string;
  projectName: string;
  category: string;
  role: string;
  summary: string;
  problem: string;
  decision: string;
  outcome: string;
  image?: string;
  imageAlt?: string;
  steps: string[];
  requirements?: { need: string; response: string }[];
  lesson?: string;
  source?: { label: string; url: string };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "sushilab", projectName: "Sushi Lab", category: "Client product", role: "Product scoping, design and solo engineering",
    summary: "Turning a confusing restaurant website into a clear path to order.",
    problem: "A new restaurant in Chartres needed a website customers could use to place an order. Its existing WordPress template buried the menu, delivery and takeaway behind pages the business did not need.",
    decision: "I scoped the product around the customer’s route to an order and the restaurant’s route to receiving it. That meant clear navigation, ordering and reservation flows, and confirmations for both sides. I also identified unnecessary recurring hosting and email costs, and kept the initial system focused on the storefront and notifications, without adding a separate admin application or database.",
    outcome: "Delivered the French and English website with delivery, takeaway, schedule-ahead ordering, lunch-hour availability and reservations. Each order or reservation connects to customer confirmation and restaurant email and Telegram alerts. Development continued through iteration on how customers used the site.",
    image: "/images/work/sushilab.jpg", imageAlt: "SushiLab’s public restaurant website, showing the bilingual navigation, food photography and online ordering action.",
    steps: ["Customer needs", "Product scope", "Order & reservation flows", "Customer & staff confirmations"],
    requirements: [
      { need: "Find the menu and place an order", response: "Clear entry points for the menu, delivery and takeaway, replacing the cluttered template navigation." },
      { need: "Fit the restaurant’s working day", response: "Schedule-ahead ordering, lunch items available during lunch hours, and a guided reservation flow." },
      { need: "Keep customers and staff informed", response: "Customer confirmations, a full order in the restaurant inbox, and Telegram alerts for staff." },
      { need: "Work for local customers on their devices", response: "French and English with translated routes and layouts tailored to mobile and desktop." },
      { need: "Keep the first version practical to run", response: "A focused storefront and notification flow, with recurring services reviewed against the business’s actual needs." },
    ],
    lesson: "Product scope came from how customers order and how the restaurant responds. The stack followed those requirements.",
    source: { label: "Read the original product story on LinkedIn", url: "https://www.linkedin.com/feed/update/urn:li:activity:7459114426735185921/" },
  },
  {
    slug: "grounded-legal-drafting", projectName: "Grounded Legal Drafting", category: "AI Engineer take-home", role: "Independent implementation",
    summary: "Generated drafts that keep the source evidence within reach.",
    problem: "Document-based drafting needs more than plausible text. An operator needs to inspect where a claim came from and correct the output.",
    decision: "Connect parsing and OCR to hybrid retrieval. Keep source spans, page references and evidence regions attached to the drafting workflow, with a review interface for operator edits.",
    outcome: "Built a document-to-draft workflow with evidence review and checks for unsupported claims. Captured edits and reused recurring style rules during regeneration. This was an interview take-home, not a client engagement.",
    steps: ["Documents & OCR", "Hybrid retrieval", "Source-linked draft", "Operator review"],
  },
  {
    slug: "crosspost", projectName: "crosspost", category: "Independent tool", role: "CLI and integration engineering",
    summary: "Publishing across platforms without starting over after a partial failure.",
    problem: "A publishing run can succeed on one platform and fail on another. Repeating the whole run risks duplicating completed posts.",
    decision: "Validate media first, expose a dry-run preview and record successful publications per account. Use that ledger to decide what remains on a retry.",
    outcome: "Built a Python CLI for YouTube, Facebook and Instagram with validation, dry-run previews and resumable publishing. The implementation is available in the public repository.",
    steps: ["Validate media", "Dry-run preview", "Platform uploads", "Per-account ledger"],
  },
];
