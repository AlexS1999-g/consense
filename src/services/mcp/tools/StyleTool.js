import { MCPTool } from '../MCPTool';
import { PROMPT_MODES } from '../../../data/PromptModes';

export class StyleProfileTool extends MCPTool {
    constructor() {
        super("Style Profile Applier", "Injects persona-driven stylistic constraints into the MCP.");
    }

    async execute(input, context) {
        // input is the MCP object (or we modify context.mcp)
        const mcp = input || context.mcp;
        const modeKey = (context.uiState.mode || 'CREATIVE').toUpperCase();

        // Find Mode Config
        const modeConfig = Object.values(PROMPT_MODES).find(m => m.id.toUpperCase() === modeKey) || PROMPT_MODES.CREATIVE;

        // Apply Mode Defaults to MCP
        // 1. Perspective
        if (modeKey === 'CREATIVE') mcp.intent.perspective = 'cinematic';
        else if (modeKey === 'DEVELOPER') mcp.intent.perspective = 'technical';
        else if (modeKey === 'RESEARCH') mcp.intent.perspective = 'editorial';
        else if (modeKey === 'GROWTH') mcp.intent.perspective = 'marketing';
        else if (modeKey === 'EXPERIMENTAL') mcp.intent.perspective = 'abstract';
        else mcp.intent.perspective = 'expert'; // fallback

        // 2. Tone (Merge, don't just overwrite if user provided specific tones?)
        // For now, we seed with the Mode's default tone if empty
        if (!context.uiState.tone || context.uiState.tone === 'Neutral') {
            mcp.constraints.tone = [modeConfig.defaults.tone];
        }

        // 3. Abstraction
        if (!context.uiState.abstraction_level) {
            mcp.constraints.abstraction_level = modeConfig.defaults.abstraction || 'mid';
        }

        // Store active persona for the rewriter
        context.activePersona = modeConfig;

        return mcp;
    }
}
