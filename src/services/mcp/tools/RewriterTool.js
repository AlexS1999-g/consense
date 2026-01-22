import { MCPTool } from '../MCPTool';
import { PromptParser } from '../../PromptParser';

export class PromptRewriterTool extends MCPTool {
    constructor() {
        super("Prompt Rewriter", "Uses an LLM to expand the MCP into a full Master Prompt.");
    }

    async execute(input, context) {
        // Context requires: mcp, diagnostics, activePersona, apiKey, userQuery
        const { mcp, diagnostics, activePersona, apiKey, userQuery } = context;

        if (!apiKey) throw new Error("API Key required for Rewriter Tool");

        const systemPrompt = `${activePersona.systemInstruction}

You are an expert Prompt Engineer. Your goal is to expand the user's intent into a highly detailed, professional prompt optimized for advanced LLMs.
    
DRAFT INPUT (GENERIC STARTING POINT):
${JSON.stringify(mcp, null, 2)}

DIAGNOSTIC REPORT:
${JSON.stringify(diagnostics, null, 2)}

INSTRUCTIONS:
1. Treat the "DRAFT INPUT" above as a generic placeholder. DO NOT copy it verbatim.
2. Review the Diagnostic Report for missing or vague details.
3. **MANDATORY RE-WRITE (STRICT ENGINEERING):**
   - **Constraint:** The output MUST be a prompt for BUILDING A SOFTWARE PRODCUT (Websites, Apps, Dashboards).
   - **Tone Translation:**
     - "Cinematic" = Immersive video backgrounds, smooth scroll parallax, WebGL transitions (NOT a movie script).
     - "Visionary" = Avant-garde UI, Brutalist layout, Experimental navigation (NOT a philosophy essay).
     - "Narrative" = User Journey Map, Scrollytelling UX (NOT a novel).
   - **Objective:** You must start with "# 1. PROJECT OBJECTIVE" and explicitly state: "Build a [Type] Website/App that...".
   - **Layers:** List technical components (e.g. "React Components", "Three.js Canvas", "REST API Endpoints").

4. **CRITICAL: TECHNICAL BLUEPRINT ONLY:**
   - **ABSOLUTELY FORBIDDEN:** "Opening Sequence", "Fade in", "The room is quiet", "A story begins".
   - **REQUIRED:** "Hero Section", "Navigation Bar", "Feature Grid", "Tech Stack".
   - Write like a CTO or Lead Architect giving instructions to a Senior Developer.
   - Use Markdown Headers (# 1. Context, # 2. Objective) and bullet points. Be punchy.
5. **OUTPUT FORMAT (JSON ONLY - MANDATORY):**
   Return a JSON object with this EXACT structure. You MUST populate "why_it_works" and "variations" arrays.
   {
     "master_prompt": "(The full Markdown master prompt string, adhering to the standard MCP structure)",
     "why_it_works": ["Reason 1: Tone choice...", "Reason 2: Specific constraints...", "Reason 3: Audience alignment..."],
     "variations": [
         { "label": "Concise", "prompt": "(A shorter version)" },
         { "label": "Extreme", "prompt": "(A radical version)" }
     ]
   }
`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `User Request: "${userQuery}"` }
                    ],
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Rewriter tool failed');
            }

            const data = await response.json();
            let content = data.choices[0].message.content;

            // Clean Markdown code blocks if present
            if (content.startsWith('```')) {
                content = content.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
            }

            let jsonResponse;
            try {
                jsonResponse = JSON.parse(content);
            } catch (e) {
                console.error("JSON Parse Failed:", content);
                // Fallback: Try to find a JSON object regex-style if pure parse fails
                const match = content.match(/\{[\s\S]*\}/);
                if (match) {
                    try { jsonResponse = JSON.parse(match[0]); } catch (e2) { throw e; }
                } else {
                    throw e;
                }
            }

            console.log("Rewriter Output Keys:", Object.keys(jsonResponse)); // Debug

            const masterPrompt = jsonResponse.master_prompt || jsonResponse.prompt || "";
            const explanation = jsonResponse.why_it_works || jsonResponse.why_this_works || [];
            const variations = jsonResponse.variations || jsonResponse.alternatives || [];

            // Construct Raw Draft
            const rawDraft = {
                prompt_mcp: mcp,
                rendered_prompt: masterPrompt,
                metadata: {
                    renderer: "consense-mcp-pipeline-v2-json",
                    version: "2.0",
                    generated_at: new Date().toISOString()
                },
                _mcp: mcp,
                core_idea: mcp.domain.subject,
                intent_goals: mcp.intent.primary_goal,
                target_audience: "Derived from extensive AI analysis",
                tone_personality: mcp.constraints.tone.join(", "),
                visual_theme: "AI Generated Theme",
                layout_dimensions: "AI Optimized Layout",
                functional_components: mcp.composition.layers,
                expansion_prompt: masterPrompt,

                // NEW FIELDS
                why_it_works: explanation,
                prompt_variations: variations
            };

            // Hydrate and return (parse the Master Prompt for metadata)
            return PromptParser.parse(masterPrompt, rawDraft);

        } catch (error) {
            console.error("Rewriter Error:", error);
            throw error;
        }
    }
}
