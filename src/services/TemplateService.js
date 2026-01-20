export const TemplateService = {
    STORAGE_KEY: 'consense_templates',

    // Get all templates
    getTemplates: () => {
        const stored = localStorage.getItem(TemplateService.STORAGE_KEY);
        if (!stored) return TemplateService.getDefaultTemplates();
        return JSON.parse(stored);
    },

    // Save a new template
    saveTemplate: (template) => {
        const templates = TemplateService.getTemplates();
        const newTemplate = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            ...template
        };
        templates.unshift(newTemplate);
        localStorage.setItem(TemplateService.STORAGE_KEY, JSON.stringify(templates));
        return newTemplate;
    },

    // Delete a template
    deleteTemplate: (id) => {
        const templates = TemplateService.getTemplates().filter(t => t.id !== id);
        localStorage.setItem(TemplateService.STORAGE_KEY, JSON.stringify(templates));
        return templates;
    },

    // Seed defaults if empty
    getDefaultTemplates: () => {
        return [
            {
                id: 'default-1',
                name: 'SaaS Launch Strategy',
                description: 'High-conversion landing page structure for B2B SaaS',
                mcp: {
                    domain: { subject: "B2B SaaS Platform", realism: "clean", focus: ["Conversion", "Trust"] },
                    intent: { type: "visualize", primary_goal: "Drive demo signups", perspective: "technical" },
                    output_target: { medium: "web", model_family: "llm" },
                    constraints: { tone: ["Professional", "Clear"], verbosity: "medium", abstraction_level: "low" },
                    composition: { layers: ["Hero with Value Prop", "Social Proof Grid", "Feature Deep Dive", "Pricing"] }
                }
            },
            {
                id: 'default-2',
                name: 'Academic Research Assistant',
                description: 'Rigorous structure for summarizing papers',
                mcp: {
                    domain: { subject: "Research Topic", realism: "factual", focus: ["Accuracy", "Citations"] },
                    intent: { type: "analyze", primary_goal: "Synthesize key findings", perspective: "historical" },
                    output_target: { medium: "text", model_family: "llm" },
                    constraints: { tone: ["Academic", "Objective"], verbosity: "high", abstraction_level: "high" },
                    composition: { layers: ["Abstract Summary", "Methodology Review", "Critical Analysis", "References"] }
                }
            },
            {
                id: 'default-3',
                name: 'UI/UX Design Audit',
                description: 'Framework for evaluating interface usability and aesthetics',
                mcp: {
                    domain: { subject: "Product Interface", realism: "stylized", focus: ["Usability", "Aesthetics", "Accessibility"] },
                    intent: { type: "analyze", primary_goal: "Identify friction points and UI inconsistencies", perspective: "technical" },
                    output_target: { medium: "audit", model_family: "llm" },
                    constraints: { tone: ["Objective", "Constructive", "Sleek"], verbosity: "medium", abstraction_level: "medium" },
                    composition: { layers: ["Visual Consistency Check", "Interaction Flow Analysis", "Color & Typography Audit", "Actionable Recommendations"] }
                }
            },
            {
                id: 'default-4',
                name: 'Technical Documentation Framework',
                description: 'Standardized structure for high-quality software docs',
                mcp: {
                    domain: { subject: "API/Software Logic", realism: "factual", focus: ["Clarity", "Maintainability"] },
                    intent: { type: "describe", primary_goal: "Enable developers to integrate with zero friction", perspective: "technical" },
                    output_target: { medium: "markdown", model_family: "llm" },
                    constraints: { tone: ["Minimal", "Clear", "Precise"], verbosity: "high", abstraction_level: "low" },
                    composition: { layers: ["Getting Started Guide", "Key Concepts", "Endpoint Reference", "Error Handling"] }
                }
            },
            {
                id: 'default-5',
                name: 'Creative World Building',
                description: 'expansive world-building for writers and game designers',
                mcp: {
                    domain: { subject: "Fictional Universe", realism: "stylized", focus: ["Lore", "Atmosphere"] },
                    intent: { type: "visualize", primary_goal: "Create an immersive setting with deep history", perspective: "cinematic" },
                    output_target: { medium: "world-doc", model_family: "llm" },
                    constraints: { tone: ["Evocative", "Mysterious", "Detailed"], verbosity: "high", abstraction_level: "high" },
                    composition: { layers: ["Geography & Climate", "Magic/Tech Systems", "Political Landmarks", "Factions & Culture"] }
                }
            },
            {
                id: 'default-6',
                name: 'High-Impact Social Strategy',
                description: 'Viral content generation framework for tech brands',
                mcp: {
                    domain: { subject: "Brand Content", realism: "hyper-surreal", focus: ["Engagement", "Virality"] },
                    intent: { type: "visualize", primary_goal: "Capture attention in a crowded feed", perspective: "cinematic" },
                    output_target: { medium: "social-media", model_family: "llm" },
                    constraints: { tone: ["Bold", "Disruptive", "Untraditional"], verbosity: "low", abstraction_level: "medium" },
                    composition: { layers: ["Hook Analysis", "Narrative Threads", "Visual Descriptors", "Call to Action"] }
                }
            },
            {
                id: 'default-7',
                name: 'SQL Query Architect',
                description: 'Optimized PostgreSQL and NoSQL query generation',
                mcp: {
                    domain: { subject: "Database Logic", realism: "factual", focus: ["Performance", "Security"] },
                    intent: { type: "simulate", primary_goal: "Build efficient, injection-proof database queries", perspective: "technical" },
                    output_target: { medium: "sql", model_family: "llm" },
                    constraints: { tone: ["Dry", "Logical", "Precise"], verbosity: "medium", abstraction_level: "low" },
                    composition: { layers: ["Schema Context", "Join Optimization", "Constraint Handling", "Execution Plan Analysis"] }
                }
            },
            {
                id: 'default-8',
                name: 'Post-Mortem Analysis',
                description: 'Structured incident report for system failures',
                mcp: {
                    domain: { subject: "Incident Management", realism: "factual", focus: ["Root Cause", "Prevention"] },
                    intent: { type: "analyze", primary_goal: "Extract learnings from critical system outages", perspective: "technical" },
                    output_target: { medium: "report", model_family: "llm" },
                    constraints: { tone: ["Objective", "Blameless", "Accountable"], verbosity: "high", abstraction_level: "medium" },
                    composition: { layers: ["Timeline of Events", "Root Cause Discovery", "Blast Radius Assessment", "Action Items"] }
                }
            },
            {
                id: 'default-9',
                name: 'Pitch Deck Storyteller',
                description: 'Narrative structure for early-stage startup pitches',
                mcp: {
                    domain: { subject: "Venture Capital", realism: "stylized", focus: ["Vision", "Traction"] },
                    intent: { type: "visualize", primary_goal: "Secure investment through compelling storytelling", perspective: "editorial" },
                    output_target: { medium: "pitch-deck", model_family: "llm" },
                    constraints: { tone: ["Ambitious", "Confident", "Grounded"], verbosity: "medium", abstraction_level: "high" },
                    composition: { layers: ["The Problem Hook", "The Solution Paradigm", "Market Opportunity", "The Big Vision"] }
                }
            },
            {
                id: 'default-10',
                name: 'Legal Doc Simplifier',
                description: 'Translates complex TOS and contracts into plain English',
                mcp: {
                    domain: { subject: "Legal Contracts", realism: "factual", focus: ["Risk", "Clarity"] },
                    intent: { type: "describe", primary_goal: "Empower non-lawyers to understand liability", perspective: "editorial" },
                    output_target: { medium: "summary", model_family: "llm" },
                    constraints: { tone: ["Helpful", "Cautionary", "Simple"], verbosity: "medium", abstraction_level: "low" },
                    composition: { layers: ["Key Commitments", "Hidden Risks", "Termination Clauses", "TL;DR Summary"] }
                }
            },
            {
                id: 'default-11',
                name: 'Clean Code Refactor',
                description: 'Transforms legacy code into modern, maintainable patterns',
                mcp: {
                    domain: { subject: "Codebase Quality", realism: "factual", focus: ["Dryness", "Readability"] },
                    intent: { type: "simulate", primary_goal: "Eliminate technical debt and improve modularity", perspective: "technical" },
                    output_target: { medium: "code", model_family: "llm" },
                    constraints: { tone: ["Disciplined", "Orderly"], verbosity: "medium", abstraction_level: "low" },
                    composition: { layers: ["Pattern Identification", "Separation of Concerns", "Error Boundary Implementation", "Unit Test Scaffolding"] }
                }
            },
            {
                id: 'default-12',
                name: 'Cyberpunk Narrative Engine',
                description: 'Neon-soaked, gritty sci-fi world-building helper',
                mcp: {
                    domain: { subject: "Cyberpunk Fiction", realism: "stylized", focus: ["Atmosphere", "High Tech/Low Life"] },
                    intent: { type: "visualize", primary_goal: "Draft atmospheric scenes with sensory detail", perspective: "cinematic" },
                    output_target: { medium: "fiction", model_family: "llm" },
                    constraints: { tone: ["Gritty", "Cynical", "Lush"], verbosity: "high", abstraction_level: "high" },
                    composition: { layers: ["Sensory Atmosphere", "Slang & Vernacular", "Technological Decay", "Character Motivation"] }
                }
            },
            {
                id: 'default-13',
                name: 'Product Roadmap Architect',
                description: 'Strategic planning for multi-quarter product releases',
                mcp: {
                    domain: { subject: "Product Development", realism: "factual", focus: ["Strategy", "Prioritization"] },
                    intent: { type: "analyze", primary_goal: "Align stakeholders around a long-term vision", perspective: "technical" },
                    output_target: { medium: "roadmap", model_family: "llm" },
                    constraints: { tone: ["Pragmatic", "Strategic", "Visionary"], verbosity: "medium", abstraction_level: "high" },
                    composition: { layers: ["Quarterly Themes", "Feature Categorization", "Dependency Mapping", "Success Metrics (KPIs)"] }
                }
            },
            {
                id: 'default-14',
                name: 'Brand Voice Harmonizer',
                description: 'Ensures copy adheres to a strict brand persona',
                mcp: {
                    domain: { subject: "Brand Identity", realism: "clean", focus: ["Consistency", "Voice"] },
                    intent: { type: "describe", primary_goal: "Maintain a unified brand presence across channels", perspective: "editorial" },
                    output_target: { medium: "copywriting", model_family: "llm" },
                    constraints: { tone: ["Consistent", "Branded"], verbosity: "varied", abstraction_level: "medium" },
                    composition: { layers: ["Tone Alignment", "Grammatical Standards", "Banned Vocabulary", "Emotional Archetype"] }
                }
            },
            {
                id: 'default-15',
                name: 'UX Microcopy Assistant',
                description: 'Crafts buttons, tooltips, and error states that guide users',
                mcp: {
                    domain: { subject: "User Interface", realism: "stylized", focus: ["Clarity", "Speed"] },
                    intent: { type: "visualize", primary_goal: "Reduce cognitive load through clear instruction", perspective: "technical" },
                    output_target: { medium: "microcopy", model_family: "llm" },
                    constraints: { tone: ["Helpful", "Invisible", "Friendly"], verbosity: "low", abstraction_level: "low" },
                    composition: { layers: ["Action Verification", "Feedback Messages", "Onboarding Hints", "Error Recovery Paths"] }
                }
            },
            {
                id: 'default-16',
                name: 'The Pareto Study Guide',
                description: 'Learn 80% of a topic in 20% of the time',
                mcp: {
                    domain: { subject: "Learning & Education", realism: "factual", focus: ["Efficiency", "Retention"] },
                    intent: { type: "analyze", primary_goal: "Identify core concepts for rapid mastery", perspective: "technical" },
                    output_target: { medium: "study-plan", model_family: "llm" },
                    constraints: { tone: ["No-nonsense", "Educational"], verbosity: "medium", abstraction_level: "medium" },
                    composition: { layers: ["The Fundamental 20%", "Analogy Mapping", "Common Pitfalls", "Self-Assessment Quiz"] }
                }
            },
            {
                id: 'default-17',
                name: 'D&D Dungeon Master Aid',
                description: 'Generates encounters, NPCs, and dynamic quest hooks',
                mcp: {
                    domain: { subject: "Tabletop RPG", realism: "stylized", focus: ["Adventure", "Variety"] },
                    intent: { type: "visualize", primary_goal: "Keep players engaged through unpredictable drama", perspective: "cinematic" },
                    output_target: { medium: "campaign-notes", model_family: "llm" },
                    constraints: { tone: ["Theatrical", "Vivid", "Adaptive"], verbosity: "high", abstraction_level: "high" },
                    composition: { layers: ["Combat Encounters", "NPC Secrets", "Loot & Rewards", "Global Consequences"] }
                }
            },
            {
                id: 'default-18',
                name: 'SEO Content Pillar',
                description: 'High-ranking blog structures based on semantic keywords',
                mcp: {
                    domain: { subject: "Digital Marketing", realism: "clean", focus: ["Ranking", "Value"] },
                    intent: { type: "analyze", primary_goal: "Own the search result for a specific niche", perspective: "editorial" },
                    output_target: { medium: "article", model_family: "llm" },
                    constraints: { tone: ["Informative", "Standardized", "Helpful"], verbosity: "high", abstraction_level: "medium" },
                    composition: { layers: ["H1-H3 Semantic Hierarchy", "Internal Link Map", "Featured Snippet Optimization", "User Intent Matching"] }
                }
            },
            {
                id: 'default-19',
                name: 'The Minimalist Meal Plan',
                description: 'High-protein, low-friction weekly eating habits',
                mcp: {
                    domain: { subject: "Health & Nutrition", realism: "factual", focus: ["Simplicity", "Sustenance"] },
                    intent: { type: "describe", primary_goal: "Automate healthy eating decisions", perspective: "editorial" },
                    output_target: { medium: "meal-plan", model_family: "llm" },
                    constraints: { tone: ["Practical", "Direct"], verbosity: "low", abstraction_level: "low" },
                    composition: { layers: ["Grocery Inventory", "Preparation Workflow", "Macro Breakdown", "Waste Minimization"] }
                }
            },
            {
                id: 'default-20',
                name: 'Vulnerability Bounty Hunter',
                description: 'Scans logic and patterns for security flaws',
                mcp: {
                    domain: { subject: "Application Security", realism: "factual", focus: ["Exploits", "Mitigation"] },
                    intent: { type: "analyze", primary_goal: "Identify and fix common OWASP vulnerabilities", perspective: "technical" },
                    output_target: { medium: "security-audit", model_family: "llm" },
                    constraints: { tone: ["Vigilant", "Strict"], verbosity: "high", abstraction_level: "low" },
                    composition: { layers: ["Attack Vector Mapping", "Logic Flaw Detection", "Remediation Snippets", "Security Headers"] }
                }
            },
            {
                id: 'default-21',
                name: 'Zen Habit Architect',
                description: 'Build lasting routines through micro-atomic shifts',
                mcp: {
                    domain: { subject: "Personal Growth", realism: "stylized", focus: ["Routine", "Psychology"] },
                    intent: { type: "describe", primary_goal: "Change behavior through small, compound actions", perspective: "editorial" },
                    output_target: { medium: "habit-stack", model_family: "llm" },
                    constraints: { tone: ["Calm", "Encouraging", "Stoic"], verbosity: "medium", abstraction_level: "high" },
                    composition: { layers: ["Trigger Identification", "The Micro-Habit", "Reward Mechanism", "Failure Recovery"] }
                }
            },
            {
                id: 'default-22',
                name: 'Crisis PR Response',
                description: 'Drafts responses for high-pressure corporate fallout',
                mcp: {
                    domain: { subject: "Public Relations", realism: "clean", focus: ["Trust", "Neutrality"] },
                    intent: { type: "describe", primary_goal: "Stabilize brand sentiment during an active crisis", perspective: "editorial" },
                    output_target: { medium: "statement", model_family: "llm" },
                    constraints: { tone: ["Sincere", "Brief", "Cautious"], verbosity: "low", abstraction_level: "medium" },
                    composition: { layers: ["The Acknowledgement", "Corrective Actions", "Stakeholder Compassion", "Next Update Commitment"] }
                }
            },
            {
                id: 'default-23',
                name: 'Data Viz Storyteller',
                description: 'Turns raw CSV/JSON concepts into compelling charts',
                mcp: {
                    domain: { subject: "Data Analytics", realism: "clean", focus: ["Trends", "Insights"] },
                    intent: { type: "visualize", primary_goal: "Make data understandable to executive leadership", perspective: "technical" },
                    output_target: { medium: "presentation", model_family: "llm" },
                    constraints: { tone: ["Data-centric", "Clarity-first"], verbosity: "medium", abstraction_level: "medium" },
                    composition: { layers: ["Key Trend Identification", "Chart Type Recommendation", "The 'So What?' Insight", "Anomalies Deep Dive"] }
                }
            },
            {
                id: 'default-24',
                name: 'Dark Fantasy Plot Weaver',
                description: 'High-stakes, morally grey narrative design',
                mcp: {
                    domain: { subject: "Dark Fantasy", realism: "stylized", focus: ["Conflict", "Doom"] },
                    intent: { type: "visualize", primary_goal: "Draft complex plots where every choice has a cost", perspective: "cinematic" },
                    output_target: { medium: "outline", model_family: "llm" },
                    constraints: { tone: ["Bleak", "Grandious", "Intense"], verbosity: "high", abstraction_level: "high" },
                    composition: { layers: ["Moral Dilemmas", "Tragic Flaws", "Supernatural Threats", "The Inevitable Sacrifice"] }
                }
            },
            {
                id: 'default-25',
                name: 'Regex Decipherer',
                description: 'Explains and generates complex regular expressions',
                mcp: {
                    domain: { subject: "Pattern Matching", realism: "factual", focus: ["Accuracy", "Edges"] },
                    intent: { type: "describe", primary_goal: "Make unreadable patterns accessible to mortals", perspective: "technical" },
                    output_target: { medium: "explainer", model_family: "llm" },
                    constraints: { tone: ["Helpful", "Logical"], verbosity: "medium", abstraction_level: "low" },
                    composition: { layers: ["Pattern Breakdown", "Capture Group Analysis", "Lookahead Explanations", "Test Cases"] }
                }
            },
            {
                id: 'default-26',
                name: 'Customer Persona Builder',
                description: 'Deep psychological profiles for target markets',
                mcp: {
                    domain: { subject: "Market Research", realism: "stylized", focus: ["Empathy", "Behavior"] },
                    intent: { type: "describe", primary_goal: "Understand the 'Who' behind the data", perspective: "editorial" },
                    output_target: { medium: "persona-doc", model_family: "llm" },
                    constraints: { tone: ["Empathetic", "Observational"], verbosity: "high", abstraction_level: "medium" },
                    composition: { layers: ["Core Fears & Desires", "Daily Friction Points", "Media Consumption Habits", "Purchasing Decision Logic"] }
                }
            },
            {
                id: 'default-27',
                name: 'The Socratic Tutor',
                description: 'Learn through guided questioning rather than answers',
                mcp: {
                    domain: { subject: "Critical Thinking", realism: "factual", focus: ["Discovery", "Logic"] },
                    intent: { type: "analyze", primary_goal: "Lead the user to their own realization", perspective: "historical" },
                    output_target: { medium: "dialogue", model_family: "llm" },
                    constraints: { tone: ["Inquisitive", "Patient", "Wise"], verbosity: "medium", abstraction_level: "high" },
                    composition: { layers: ["Assumption Challenge", "Logical Extension", "Counter-example Generation", "Synthesis Questions"] }
                }
            },
            {
                id: 'default-28',
                name: 'App Store Optimizer (ASO)',
                description: 'Maximize downloads for iOS and Android apps',
                mcp: {
                    domain: { subject: "Mobile Growth", realism: "clean", focus: ["Keywords", "Conversion"] },
                    intent: { type: "analyze", primary_goal: "Increase organic visibility on app stores", perspective: "editorial" },
                    output_target: { medium: "store-listing", model_family: "llm" },
                    constraints: { tone: ["Persuasive", "Optimized", "Punchy"], verbosity: "medium", abstraction_level: "low" },
                    composition: { layers: ["App Title Hook", "Keyword-rich Subtitle", "Promotional Text", "The High-Conversion Description"] }
                }
            },
            {
                id: 'default-29',
                name: 'Legacy Migration Strategist',
                description: 'Retiring old monoliths for modern microservices',
                mcp: {
                    domain: { subject: "Cloud Infrastructure", realism: "factual", focus: ["Risk", "Continuity"] },
                    intent: { type: "analyze", primary_goal: "Retire high-maintenance systems without downtime", perspective: "technical" },
                    output_target: { medium: "migration-plan", model_family: "llm" },
                    constraints: { tone: ["Conservative", "Reliable", "Step-by-step"], verbosity: "high", abstraction_level: "medium" },
                    composition: { layers: ["Dependency Graph", "Strangler Fig Implementation", "Data Synchronization Phase", "Sunset Checklist"] }
                }
            },
            {
                id: 'default-30',
                name: 'The Stoic Journal Prompt',
                description: 'Daily reflections for psychological resilience',
                mcp: {
                    domain: { subject: "Philosophy", realism: "stylized", focus: ["Clarity", "Resilience"] },
                    intent: { type: "visualize", primary_goal: "Achieve mental tranquility through deep reflection", perspective: "historical" },
                    output_target: { medium: "journal", model_family: "llm" },
                    constraints: { tone: ["Stoic", "Grounded", "Severe"], verbosity: "low", abstraction_level: "high" },
                    composition: { layers: ["Morning Premeditation", "Amor Fati Acceptance", "Evening Review", "Dichotomy of Control Check"] }
                }
            }
        ];
    }
};
