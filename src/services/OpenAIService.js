import { MCPBuilder } from './mcpBuilder';
import { MCPPipeline } from './mcp/MCPPipeline';
import { PromptAnalyzerTool } from './mcp/tools/AnalyzerTool';
import { StyleProfileTool } from './mcp/tools/StyleTool';
import { ConstraintInjectorTool } from './mcp/tools/ConstraintTool';
import { PromptRewriterTool } from './mcp/tools/RewriterTool';

export const OpenAIService = {
    generateDraft: async (userQuery, uiState = {}, apiKey) => {
        if (!apiKey) throw new Error("API Key is required for OpenAI Service");

        // 1. Initialize Context & Base MCP
        // Heuristic builder creates the "Generic Starting Point"
        const baseMcp = MCPBuilder.buildFromInput(userQuery, {}); // Passing empty state to builder, tools will layer UI state

        const context = {
            mcp: baseMcp,
            uiState: uiState,
            userQuery: userQuery,
            apiKey: apiKey,
            diagnostics: null, // Filled by tool
            activePersona: null // Filled by tool
        };

        // 2. Build Pipeline
        const pipeline = new MCPPipeline()
            .addTool(new StyleProfileTool())        // Apply Persona
            .addTool(new ConstraintInjectorTool())  // Apply UI Constraints
            .addTool(new PromptAnalyzerTool())      // Run Diagnostics
            .addTool(new PromptRewriterTool());     // Expand & Rewite

        // 3. Execute
        // Pass baseMcp as initial input (though tools mostly read from context)
        // Analyzer expects String, others expect MCP.
        // Wait, Analyzer takes Input. If Constraint tool returns MCP, Analyzer fails.
        // I need to adapt AnalyzerTool to handle Object input (ignore it) or read from context.
        // OR pass userQuery explicitly in Analyzer execute.

        // Actually, let's look at AnalyzerTool. "if (typeof input !== 'string')".
        // It will fail if I pass MCP.
        // I should fix AnalyzerTool to check context.userQuery if input is not string.

        return await pipeline.execute(baseMcp, context); // Pass baseMcp as initial input
    },

    refineDraft: async (currentDraft, instruction, uiState = {}, apiKey) => {
        if (!apiKey) throw new Error("API Key is required for OpenAI Service");

        const mcp = currentDraft.prompt_mcp || currentDraft._mcp;
        if (uiState.depth) mcp.intent.depth = uiState.depth;
        const modeKey = (uiState.mode || 'CREATIVE').toUpperCase();
        // Find the mode object where ID matches (handle creative/director casing mismatch if any, but ID is 'creative')
        const modeConfig = Object.values(PROMPT_MODES).find(m => m.id.toUpperCase() === modeKey) || PROMPT_MODES.CREATIVE;

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
                        { role: 'user', content: `Refine this prompt based on: "${instruction}"` }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'OpenAI refinement failed');
            }

            const data = await response.json();
            const generatedText = data.choices[0].message.content;

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
