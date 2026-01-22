import { MCP } from './MCPService';
import { MCPBuilder } from './mcpBuilder';
import { renderForLLM } from '../renderers/llmRenderer';
import { DiagnosticService } from './DiagnosticService';
import { PromptParser } from './PromptParser';

export const OllamaService = {
    // Check if Ollama is reachable
    checkConnection: async () => {
        try {
            const response = await fetch('/api/ollama/tags');
            return response.ok;
        } catch (e) {
            console.warn("Ollama connection failed:", e);
            return false;
        }
    },

    generateDraft: async (userQuery, uiState = {}) => {
        // 1. Build MCP (Client-side logic still holds!)
        const modeKey = (uiState.mode || 'CREATIVE').toUpperCase();
        const modeConfig = Object.values(PROMPT_MODES).find(m => m.id.toUpperCase() === modeKey) || PROMPT_MODES.CREATIVE;
        const augmentedState = {
            ...modeConfig.defaults,
            ...uiState
        };
        const mcp = MCPBuilder.buildFromInput(userQuery, augmentedState);
        const diagnostics = DiagnosticService.analyze(userQuery);

        const systemPrompt = `${modeConfig.systemInstruction}

You are an expert Prompt Engineer. Your goal is to expand the user's intent into a highly detailed, professional prompt optimized for advanced LLMs.
    
DRAFT INPUT (GENERIC STARTING POINT):
${JSON.stringify(mcp, null, 2)}

DIAGNOSTIC REPORT:
${JSON.stringify(diagnostics, null, 2)}

INSTRUCTIONS:
1. Treat the "DRAFT INPUT" above as a generic placeholder. DO NOT copy it verbatim.
2. Review the Diagnostic Report for missing or vague details.
3. **MANDATORY RE-WRITE:** You must RE-GENERATE the entire Context Model, Objective, and Layers to match your specific Persona (${modeConfig.label}).
   - **Tone:** If input says "Neutral" but you are a Creative Director, CHANGE IT to "Visionary" or "Cinematic".
   - **Audience:** Invent a specific audience (e.g., "High-Net-Worth Collectors" instead of "General Public").
   - **Objective:** Rewrite the "Core Objective" to be specific and ambitious.
   - **Layers:** Invent specific features relevant to the domain (e.g. "360 Car Configurator" instead of "Multimedia Gallery").
4. Output the full Master Prompt structure with your NEW, SPECIFIC values.
`;

        // 2. Call Ollama
        try {
            const response = await fetch('/api/ollama/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3', // Default, we can make this configurable later
                    prompt: `User Request: "${userQuery}"\n\nExpansion:`,
                    system: systemPrompt,
                    stream: false,
                    options: {
                        temperature: 0.7
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Ollama generation failed');
            }

            const data = await response.json();
            const generatedText = data.response;

            // 3. Construct Contract
            const rawDraft = {
                prompt_mcp: mcp,
                rendered_prompt: generatedText, // The "Real" generation!
                metadata: {
                    renderer: "ollama-llama3",
                    version: "1.0",
                    generated_at: new Date().toISOString()
                },
                // Legacy Support
                _mcp: mcp,
                core_idea: mcp.domain.subject,
                intent_goals: mcp.intent.primary_goal,
                target_audience: "Derived from extensive AI analysis",
                tone_personality: mcp.constraints.tone.join(", "),
                visual_theme: "AI Generated Theme",
                layout_dimensions: "AI Optimized Layout",
                functional_components: mcp.composition.layers,
                expansion_prompt: generatedText
            };

            return PromptParser.parse(generatedText, rawDraft);

        } catch (error) {
            console.error("Ollama Error:", error);
            throw error;
        }
    },

    refineDraft: async (currentDraft, instruction, uiState = {}) => {
        // Similar logic, but wraps the previous draft
        const mcp = currentDraft.prompt_mcp || currentDraft._mcp;

        // Apply local heuristic updates to MCP first (hybrid approach)
        // This ensures our UI controls still "feel" responsive even if the LLM ignores them
        if (uiState.depth) mcp.intent.depth = uiState.depth;

        const systemPrompt = `You are a Prompt Refinement Specialist.
    
CURRENT CONTEXT MODEL:
${JSON.stringify(mcp, null, 2)}

PREVIOUS PROMPT:
${currentDraft.expansion_prompt}

INSTRUCTION:
${instruction}

TASK:
Rewrite the prompt to incorporate the instruction. maintain the professional structure.
Output ONLY the new prompt.`;

        try {
            const response = await fetch('/api/ollama/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3',
                    prompt: `Refine this prompt based on: "${instruction}"`,
                    system: systemPrompt,
                    stream: false
                })
            });

            if (!response.ok) throw new Error('Ollama refinement failed');

            const data = await response.json();
            const generatedText = data.response;

            return {
                ...currentDraft,
                prompt_mcp: mcp,
                rendered_prompt: generatedText,
                expansion_prompt: generatedText
            };

        } catch (error) {
            throw error;
        }
    }
};
