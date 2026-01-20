import { MCP } from './MCPService';
import { MCPBuilder } from './mcpBuilder';
import { renderForLLM } from '../renderers/llmRenderer';

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
        const mcp = MCPBuilder.buildFromInput(userQuery, uiState);
        const systemPrompt = `You are an expert Prompt Engineer. Your goal is to expand the user's intent into a highly detailed, professional prompt optimized for advanced LLMs.
    
CONTEXT MODEL:
${JSON.stringify(mcp, null, 2)}

INSTRUCTIONS:
1. Analyze the Context Model above.
2. Write a single, comprehensive Master Prompt that incorporates all constraints, tones, and requirements.
3. Do NOT output any conversational text. Output ONLY the final prompt.
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
            return {
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
