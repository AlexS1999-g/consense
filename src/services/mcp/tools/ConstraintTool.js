import { MCPTool } from '../MCPTool';

export class ConstraintInjectorTool extends MCPTool {
    constructor() {
        super("Constraint Injector", "Injects user-defined constraints (format, audience, negatives) into the MCP.");
    }

    async execute(input, context) {
        const mcp = input || context.mcp;
        const ui = context.uiState || {};

        // 1. Explicit UI Overrides
        if (ui.depth) mcp.intent.depth = ui.depth;
        if (ui.tone && ui.tone !== 'Neutral') mcp.constraints.tone = Array.isArray(ui.tone) ? ui.tone : [ui.tone];
        if (ui.abstraction_level) mcp.constraints.abstraction_level = ui.abstraction_level;

        // 2. Extended Constraints
        if (ui.output_format) mcp.output_target.format = ui.output_format;
        if (ui.target_audience) mcp.intent.audience = ui.target_audience;
        if (ui.length) mcp.constraints.length = ui.length;
        if (ui.creativity) mcp.constraints.creativity = ui.creativity;

        // 3. Negatives
        mcp.negatives = mcp.negatives || { exclude: [] };
        // Base negatives
        const baseNegatives = ["Generic phrasing", "Clichés", "Buzzwords", "Redundant explanations", "Robotic transitions"];
        baseNegatives.forEach(n => {
            if (!mcp.negatives.exclude.includes(n)) mcp.negatives.exclude.push(n);
        });

        // Hype negatives
        if (ui.exclude_hype) {
            const hypeWords = ["game-changing", "revolutionary", "cutting-edge", "disruptive", "unleash", "elevate"];
            hypeWords.forEach(w => {
                if (!mcp.negatives.exclude.includes(w)) mcp.negatives.exclude.push(w);
            });
        }

        return mcp;
    }
}
