import { MCP } from './MCPService';

export const MCPBuilder = {
    /**
     * Parses user input and UI state to build a PromptMCP object.
     * @param {string} userQuery
     * @param {Object} [uiState] - Optional overrides from UI controls
     * @returns {import('./MCPService').PromptMCP}
     */
    buildFromInput: (userQuery, uiState = {}) => {
        const mcp = MCP.createDefault();
        const query = userQuery.toLowerCase();

        // 1. INFER DOMAIN (Heuristic)
        // System priority: UI State > Heuristic
        const topic = userQuery.replace(/i want a website (on|about|for)/i, "").trim() || "the subject";
        mcp.domain.subject = topic;

        // Context Detection regex logic derived from MockAIService
        const isEcom = /shop|store|sell|commerce|sneaker/i.test(query);
        const isSaaS = /platform|tool|service|dashboard|analytics/i.test(query);
        const isPortfolio = /portfolio|freelance|designer|resume/i.test(query);

        // 2. APPLY DEFAULTS BASED ON CONTEXT
        if (isEcom) {
            mcp.intent.type = "visualize";
            mcp.intent.primary_goal = "Convert high-intent browsers into loyal customers through immersive product discovery.";
            mcp.intent.perspective = "cinematic";
            mcp.domain.focus = ["Commerce", "Storytelling", "Conversion"];
            mcp.constraints.tone = ["Confident", "Polished", "Premium"];
            mcp.output_target.model_hint = "Next.js + Shopify Storefront API";
            mcp.composition.layers = ["One-tap authentication", "Personalized recommendation engine", "Interactive 3D Product Viewer"];
            mcp.domain.realism = "stylized";
        } else if (isSaaS) {
            mcp.intent.type = "simulate";
            mcp.intent.primary_goal = "Reduce operational friction by 40% through automated data synthesis.";
            mcp.intent.perspective = "technical";
            mcp.domain.focus = ["Efficiency", "Data Density", "Scalability"];
            mcp.constraints.tone = ["Reliable", "Authoritative", "Data-driven"];
            mcp.output_target.model_hint = "React-based dashboard with RBAC";
            mcp.composition.layers = ["Role-based access control", "Custom reporting engine", "Data Viz Dashboards"];
            mcp.domain.realism = "factual";
        } else if (isPortfolio) {
            mcp.intent.type = "visualize";
            mcp.intent.primary_goal = "Showcase the designer’s work, attract clients, and communicate professionalism.";
            mcp.intent.perspective = "editorial";
            mcp.domain.focus = ["Aesthetics", "Minimalism", "Interactivity"];
            mcp.constraints.tone = ["Minimal", "Confident", "Approachable"];
            mcp.output_target.model_hint = "Responsive layout with subtle animations";
            mcp.composition.layers = ["Interactive project thumbnails", "Smooth scroll", "Contact Form"];
            mcp.rendering_hints = { allow_metaphor: true, sentence_length: "varied" };
        } else {
            mcp.intent.primary_goal = `Educate and engage visitors about ${topic}.`;
            mcp.domain.focus = ["Education", "Engagement"];
            mcp.constraints.tone = ["Inquisitive", "Intellectually Stimulating"];
            mcp.composition.layers = ["Dynamic Content", "Multimedia Gallery", "Interactive Elements"];
        }

        // 3. OVERRIDE WITH UI STATE (The "System Priority")
        if (uiState.depth) mcp.intent.depth = uiState.depth;
        if (uiState.tone) {
            // If tone is passed as array or string, handle it
            mcp.constraints.tone = Array.isArray(uiState.tone) ? uiState.tone : [uiState.tone];
        }
        if (uiState.abstraction_level) mcp.constraints.abstraction_level = uiState.abstraction_level;
        if (uiState.model_family) mcp.output_target.model_family = uiState.model_family;
        if (uiState.dialect) mcp.output_target.dialect = uiState.dialect; // 'gpt' or 'claude'

        // "No hype" toggle -> add common hype words to exclude
        if (uiState.exclude_hype) {
            mcp.negatives = mcp.negatives || { exclude: [] };
            mcp.negatives.exclude.push("game-changing", "revolutionary", "cutting-edge", "disruptive");
        }

        return mcp;
    }
};
