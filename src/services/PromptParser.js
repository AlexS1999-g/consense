/**
 * Parses the generated text from an LLM and extracts updated metadata 
 * to "hydrate" the dumb draft object with smart values.
 */
export const PromptParser = {
    parse: (text, originalDraft) => {
        const smartDraft = { ...originalDraft };
        const mcp = smartDraft.prompt_mcp || smartDraft._mcp;

        // 1. EXTRACT GOAL
        // Look for content after "# 2. CORE OBJECTIVE" until next hash
        const goalMatch = text.match(/# 2\. CORE OBJECTIVE\s*\n+([^#]+)/i);
        if (goalMatch && goalMatch[1]) {
            const newGoal = goalMatch[1].trim();
            smartDraft.intent_goals = newGoal;
            if (mcp) mcp.intent.primary_goal = newGoal;
        }

        // 2. EXTRACT TONE
        const toneMatch = text.match(/\*\*Tone:\*\*\s*([^\n]+)/i);
        if (toneMatch && toneMatch[1]) {
            const newTone = toneMatch[1].trim();
            smartDraft.tone_personality = newTone;
            if (mcp) mcp.constraints.tone = newTone.split(',').map(t => t.trim());
        }

        // 3. EXTRACT AUDIENCE
        // This might be buried in Context Model or just general text if we added it
        const audienceMatch = text.match(/\*\*Audience:\*\*\s*([^\n]+)/i);
        if (audienceMatch && audienceMatch[1]) {
            const newAudience = audienceMatch[1].trim();
            smartDraft.target_audience = newAudience;
            if (mcp) mcp.intent.audience = newAudience;
        }

        // 4. EXTRACT FEATURES (LAYERS)
        // Look for list items under COMPOSITION LAYERS
        const layersSection = text.match(/# 5\. COMPOSITION LAYERS\s*\n+([^#]+)/i);
        if (layersSection && layersSection[1]) {
            const lines = layersSection[1].split('\n').map(l => l.trim()).filter(l => l.startsWith('-'));
            if (lines.length > 0) {
                const newLayers = lines.map(l => l.replace(/^-\s*/, '').trim());
                smartDraft.functional_components = newLayers;
                if (mcp) mcp.composition.layers = newLayers;
            }
        }

        // Update MCP reference
        smartDraft.prompt_mcp = mcp;
        smartDraft._mcp = mcp;

        return smartDraft;
    }
};
