/**
 * Renders a PromptMCP object into an LLM-optimized prompt string.
 * @param {import('../services/MCPService').PromptMCP} mcp 
 * @returns {string} The rendered prompt.
 */
export const renderForLLM = (mcp) => {
    // Derive Role from Context
    const roles = {
        "technical": "Senior Engineer",
        "editorial": "Editor-in-Chief",
        "cinematic": "Creative Director",
        "historical": "Archivist"
    };
    const role = roles[mcp.intent.perspective] || "Expert";

    // Dialect Switching
    if (mcp.output_target.dialect === 'claude') {
        return `<instruction>
You are an expert acting as a ${role.toUpperCase()}.

<context_model>
    <id>${mcp.id}</id>
    <intent>${mcp.intent.type} / ${mcp.intent.perspective}</intent>
    <domain>${mcp.domain.subject} (${mcp.domain.realism})</domain>
</context_model>

<core_objective>
    ${mcp.intent.primary_goal}
</core_objective>

<output_spec>
    <target>${mcp.output_target.medium} - ${mcp.output_target.model_family}</target>
    ${mcp.output_target.model_hint ? `<hint>${mcp.output_target.model_hint}</hint>` : ""}
</output_spec>

<constraints>
    <tone>${mcp.constraints.tone.join(", ")}</tone>
    <verbosity>${mcp.constraints.verbosity}</verbosity>
    ${mcp.negatives && mcp.negatives.exclude.length > 0 ? `<avoid>${mcp.negatives.exclude.join(", ")}</avoid>` : ""}
</constraints>

<structural_layers>
${mcp.composition.layers.map(l => `    <layer>${l}</layer>`).join('\n')}
</structural_layers>

</instruction>`;
    }

    // Default: GPT / Markdown
    return `**ACT AS A ${role.toUpperCase()}**

# 1. CONTEXT MODEL (MCP v${mcp.version})
**ID:** ${mcp.id}
**Intent:** ${mcp.intent.type.toUpperCase()} / ${mcp.intent.depth} / ${mcp.intent.perspective}
**Domain:** ${mcp.domain.subject} (${mcp.domain.realism})
**Focus:** ${mcp.domain.focus.join(", ")}

# 2. CORE OBJECTIVE
${mcp.intent.primary_goal}

# 3. OUTPUT SPECIFICATION
**Target:** ${mcp.output_target.medium.toUpperCase()} (${mcp.output_target.model_family})
${mcp.output_target.model_hint ? `**Hint:** ${mcp.output_target.model_hint}` : ""}

# 4. CONSTRAINTS & TONE
**Tone:** ${mcp.constraints.tone.join(", ")}
**Abstraction:** ${mcp.constraints.abstraction_level}
**Verbosity:** ${mcp.constraints.verbosity}
${mcp.negatives && mcp.negatives.exclude.length > 0 ? `**Negative Constraints:** Avoid ${mcp.negatives.exclude.join(", ")}` : ""}

# 5. COMPOSITION LAYERS
The solution must be composed of the following structural layers:
${mcp.composition.layers.map(l => `- ${l}`).join('\n')}

${mcp.rendering_hints ? `# 6. RENDERING INSTRUCTIONS
Sentence Length: ${mcp.rendering_hints.sentence_length || "Varied"}
Metaphors: ${mcp.rendering_hints.allow_metaphor ? "Allowed" : "Restricted"}
` : ""}
`;
};
