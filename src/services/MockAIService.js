import { MCP } from './MCPService';
import { MCPBuilder } from './mcpBuilder';
import { renderForLLM } from '../renderers/llmRenderer';

export const MockAIService = {
    // Simulate delay
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    generateInitialDraft: async (userQuery, uiState = {}) => {
        await MockAIService.delay(1200);

        // 1. BUILD MCP (Source of Truth)
        // Uses the Builder Service which encapsulates context detection & defaults
        const mcp = MCPBuilder.buildFromInput(userQuery, uiState);

        // 2. RENDER (Model-Specific)
        const expansionPrompt = renderForLLM(mcp);

        // 3. MAP TO UI & CONTRACT
        const draftData = {
            // New Strict Contract Fields
            prompt_mcp: mcp,
            rendered_prompt: expansionPrompt,
            metadata: {
                renderer: "llm",
                version: "0.1",
                generated_at: new Date().toISOString()
            },

            // Legacy Frontend Support (Derived from MCP)
            _mcp: mcp,
            core_idea: `${mcp.domain.subject}: ${mcp.intent.primary_goal}`,
            intent_goals: mcp.intent.primary_goal,
            target_audience: `Implied audience for ${mcp.intent.perspective} perspective with ${mcp.constraints.tone[0]} tone.`,
            tone_personality: mcp.constraints.tone.join(", "),
            visual_theme: `Visuals aligned with ${mcp.domain.realism} realism and ${mcp.intent.perspective} perspective.`,
            layout_dimensions: "Derived from composition layers.",
            functional_components: mcp.composition.layers,
            expansion_prompt: expansionPrompt
        };

        return draftData;
    },

    refineDraft: async (currentDraft, refinementInstruction, uiState = {}) => {
        await MockAIService.delay(1000);

        // Deep copy draft and MCP
        const newDraft = JSON.parse(JSON.stringify(currentDraft));
        let mcp = newDraft.prompt_mcp || newDraft._mcp; // Support new and legacy

        // Migration if missing
        if (!mcp) {
            mcp = MCP.createDefault();
            mcp.intent.primary_goal = newDraft.intent_goals;
            mcp.domain.subject = newDraft.core_idea;
        }

        const instruction = refinementInstruction.toLowerCase();

        // 1. APPLY REFINEMENTS TO MCP
        if (instruction.includes("modern") || instruction.includes("sleek")) {
            mcp.domain.realism = "stylized";
            mcp.constraints.tone = ["Bold", "Disruptive", "Untraditional"];
            mcp.rendering_hints = (mcp.rendering_hints || {});
            mcp.rendering_hints.keyword_density = "high";
            newDraft.visual_theme = "Neo-brutalism meets glassmorphism.";
        }
        else if (instruction.includes("enterprise") || instruction.includes("corp")) {
            mcp.intent.perspective = "technical";
            mcp.constraints.tone = ["Trusted", "High-Density", "Corporate"];
            mcp.domain.focus.push("Security", "Compliance");
            mcp.output_target.model_hint = "Java Spring Boot + Angular";
            newDraft.core_idea = "A compliant, scalable enterprise ecosystem.";
        }
        else if (instruction.includes("minimal")) {
            mcp.intent.perspective = "editorial";
            mcp.constraints.tone = ["Monochrome", "Radical Simplicity"];
            mcp.constraints.verbosity = "low";
            newDraft.layout_dimensions = "Single-page scroll. Zero clutter.";
        }
        // NEW: Handle Short/Concise
        else if (instruction.match(/shorter|concise|brief|cut|less/i)) {
            mcp.constraints.verbosity = "low";
            mcp.rendering_hints = (mcp.rendering_hints || {});
            mcp.rendering_hints.sentence_length = "Short & Punchy";
            // Remove last layer to simulate cutting
            if (mcp.composition.layers.length > 2) {
                mcp.composition.layers.pop();
            }
            mcp.intent.depth = "high-level";
        }
        // NEW: Handle Expand/Detail
        else if (instruction.match(/expand|detail|more|longer/i)) {
            mcp.constraints.verbosity = "verbose";
            mcp.intent.depth = "comprehensive";
            mcp.composition.layers.push("Deep Dive Section", "Technical Appendix", "Case Studies");
            mcp.rendering_hints = (mcp.rendering_hints || {});
            mcp.rendering_hints.keyword_density = "maximum";
        }
        // NEW: Handle "Pop" / Creative
        else if (instruction.match(/pop|creative|fun|cool/i)) {
            mcp.constraints.tone = ["Electric", "Vibrant", "Viral"];
            mcp.domain.realism = "hyper-surreal";
            mcp.composition.layers.push("Micro-interactions", "Easter Eggs");
        }
        else if (instruction.includes("interactive") || instruction.includes("immersive")) {
            mcp.output_target.medium = "3d";
            mcp.composition.layers.push("WebGL Hero", "Scroll-triggered Effects");
            mcp.rendering_hints = (mcp.rendering_hints || {});
            mcp.rendering_hints.allow_metaphor = true;
        }
        else if (instruction.includes("academic")) {
            mcp.intent.depth = "expert";
            mcp.intent.perspective = "technical";
            mcp.composition.layers.push("Citations", "Footnotes");
            mcp.constraints.tone = ["Rigorous", "Clear"];
        }
        else if (instruction.includes("gamify")) {
            mcp.intent.type = "simulate";
            mcp.constraints.tone = ["Playful", "Energetic"];
            mcp.composition.layers.push("Badges", "Quizzes");
        }

        // Apply UI State overrides during refinement too
        if (uiState.depth) mcp.intent.depth = uiState.depth;

        // 2. RE-RENDER
        const expansionPrompt = renderForLLM(mcp);

        // If expansion prompt didn't change (no keywords matched), force an update 
        // by appending a note. This ensures user sees *some* change.
        let finalPrompt = expansionPrompt;
        if (finalPrompt === currentDraft.expansion_prompt && instruction.length > 0) {
            // Heuristic: Just append the instruction as a constraint override
            finalPrompt += `\n\n[USER REFINEMENT]: ${refinementInstruction}`;
        }


        // 3. UPDATE OUTPUT
        newDraft.prompt_mcp = mcp;
        newDraft._mcp = mcp;
        newDraft.rendered_prompt = finalPrompt;
        newDraft.expansion_prompt = finalPrompt;

        // Sync UI fields
        newDraft.functional_components = mcp.composition.layers;
        newDraft.tone_personality = mcp.constraints.tone.join(", ");

        return newDraft;
    },

    // Generate a smart, concise title for the session history
    generateSessionTitle: (draft, originalQuery) => {
        const mcp = draft && (draft.prompt_mcp || draft._mcp);

        let title = "";

        if (mcp && mcp.domain.subject) {
            // Intelligent Extraction from MCP
            let subject = mcp.domain.subject;

            // Heuristic: If subject is just "Website" or "App", try to prepend Domain Focus
            if ((subject.toLowerCase() === 'website' || subject.toLowerCase() === 'app') && mcp.domain.focus && mcp.domain.focus.length > 0) {
                subject = `${mcp.domain.focus[0]} ${subject}`;
            }
            title = subject;
        } else {
            // Fallback to query
            title = originalQuery || "Untitled Session";
        }

        // Apply Cleaning (Stop words & Capitalization) to FINAL title, regardless of source
        // This fixes legacy/fallback titles too (e.g. "create a website" -> "Website")
        const stopWordsRegex = /^(a|an|the|create|make|design|build|generate|i want)\s+/i;
        while (stopWordsRegex.test(title)) {
            title = title.replace(stopWordsRegex, '');
        }

        title = title.trim();
        if (title.length > 0) {
            title = title.charAt(0).toUpperCase() + title.slice(1);
        }

        // Hard Limit
        if (title.length > 35) {
            title = title.substring(0, 32) + '...';
        }

        return title;
    },

    getRecommendations: (draft) => {
        // Use MCP state if available, otherwise analyze text
        const mcp = draft.prompt_mcp || draft._mcp;
        const text = (draft.core_idea || "").toLowerCase();

        // Simple heuristic based on existing logic, could be improved with MCP analysis
        const isEcom = /shop|commerce/i.test(text) || (mcp && mcp.domain.focus.includes("Commerce"));
        const isSaaS = /platform|dashboard/i.test(text) || (mcp && mcp.domain.focus.includes("Efficiency"));
        const isPortfolio = /portfolio|designer/i.test(text) || (mcp && mcp.intent.perspective === "editorial");

        const recs = [];
        if (isPortfolio) {
            recs.push({ id: 'modern', label: 'Make it Disruptive', action: 'Make it ultra-modern and sleek' });
            recs.push({ id: 'interactive', label: 'Add WebGL Magic', action: 'Make it immersive and interactive' });
        } else if (isEcom) {
            recs.push({ id: 'gamify', label: 'Gamify Loyalty', action: 'Gamify the shopping experience' });
            recs.push({ id: 'minimal', label: 'Clean & Simple', action: 'Make it ultra-minimal' });
        } else if (isSaaS) {
            recs.push({ id: 'enterprise', label: 'Scale to Enterprise', action: 'Make it enterprise-ready' });
            recs.push({ id: 'modern', label: 'Modernize UI', action: 'Make it ultra-modern and sleek' });
        } else {
            recs.push({ id: 'academic', label: 'Make it Academic', action: 'Make it academic' });
        }
        return recs.slice(0, 3);
    },

    // Hydrate a template MCP into a full draft object
    hydrateFromTemplate: (mcp) => {
        const expansionPrompt = renderForLLM(mcp);
        return {
            prompt_mcp: mcp,
            _mcp: mcp,
            captured_input: "Loaded from Template",
            rendered_prompt: expansionPrompt,
            expansion_prompt: expansionPrompt,
            core_idea: mcp.domain.subject,
            intent_goals: mcp.intent.primary_goal,
            functional_components: mcp.composition.layers,
            tone_personality: mcp.constraints.tone.join(", "),
            visual_theme: `Visuals aligned with ${mcp.domain.realism} and ${mcp.intent.perspective}`,
            layout_dimensions: "Templated Structure",
            metadata: {
                renderer: "llm",
                version: mcp.version,
                generated_at: new Date().toISOString(),
                source: "template"
            }
        };
    },

    // Helper to format the map for clipboard
    formatForClipboard: (draft) => {
        if (!draft) return "";
        return draft.expansion_prompt;
    }
};
