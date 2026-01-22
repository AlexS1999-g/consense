/**
 * @typedef {Object} PromptMCP
 * @property {string} id
 * @property {"0.1"} version
 * 
 * @property {Object} intent
 * @property {"explain" | "visualize" | "compare" | "simulate" | "speculate"} intent.type
 * @property {string} intent.primary_goal
 * @property {"beginner" | "intermediate" | "expert"} intent.depth
 * @property {"technical" | "editorial" | "cinematic" | "historical"} intent.perspective
 * 
 * @property {Object} output_target
 * @property {"text" | "image" | "3d" | "video"} output_target.medium
 * @property {"llm" | "diffusion" | "renderer"} output_target.model_family
 * @property {string} [output_target.model_hint]
 * 
 * @property {Object} domain
 * @property {string} domain.subject
 * @property {string[]} domain.focus
 * @property {string} [domain.time_range]
 * @property {"factual" | "stylized"} domain.realism
 * 
 * @property {Object} constraints
 * @property {string[]} constraints.tone
 * @property {"low" | "medium" | "high"} constraints.abstraction_level
 * @property {"low" | "medium" | "high"} constraints.verbosity
 * 
 * @property {Object} composition
 * @property {string[]} composition.layers
 * @property {string[]} [composition.emphasis]
 * 
 * @property {Object} [negatives]
 * @property {string[]} negatives.exclude
 * 
 * @property {Object} [rendering_hints]
 * @property {"short" | "varied" | "long"} [rendering_hints.sentence_length]
 * @property {"low" | "controlled" | "high"} [rendering_hints.keyword_density]
 * @property {boolean} [rendering_hints.allow_metaphor]
 */

export const MCP = {
    /**
     * Factory to create a default PromptMCP object
     * @returns {PromptMCP}
     */
    createDefault: () => ({
        id: crypto.randomUUID(),
        version: "0.1",
        intent: {
            type: "explain",
            primary_goal: "",
            depth: "intermediate",
            perspective: "technical"
        },
        output_target: {
            medium: "text",
            model_family: "llm"
        },
        domain: {
            subject: "",
            focus: [],
            realism: "factual"
        },
        constraints: {
            tone: ["neutral"],
            abstraction_level: "medium",
            verbosity: "medium"
        },
        composition: {
            layers: []
        },
        negatives: {
            exclude: []
        }
    }),

    /**
     * Renders the PromptMCP object into a Master Prompt string
     * @param {PromptMCP} mcp 
     */
    render: (mcp) => {
        // Derive Role from Context
        const roles = {
            "technical": "Senior Engineer",
            "editorial": "Editor-in-Chief",
            "cinematic": "Creative Director",
            "historical": "Archivist"
        };
        const role = roles[mcp.intent.perspective] || "Expert";

        return `**ACT AS A ${role.toUpperCase()}**

# 1. CONTEXT MODEL (MCP v${mcp.version})
**ID:** ${mcp.id}
**Intent:** ${mcp.intent.type.toUpperCase()} / ${mcp.intent.depth} / ${mcp.intent.perspective}
**Domain:** ${mcp.domain.subject} (${mcp.domain.realism})
**Focus:** ${mcp.domain.focus.join(", ")}
${mcp.intent.audience ? `**Audience:** ${mcp.intent.audience}` : ""}

# 2. CORE OBJECTIVE
${mcp.intent.primary_goal}

# 3. OUTPUT SPECIFICATION
**Target:** ${mcp.output_target.medium.toUpperCase()} (${mcp.output_target.model_family})
${mcp.output_target.format ? `**Format:** ${mcp.output_target.format}` : ""}
${mcp.output_target.model_hint ? `**Hint:** ${mcp.output_target.model_hint}` : ""}

# 4. CONSTRAINTS & TONE
**Tone:** ${mcp.constraints.tone.join(", ")}
**Abstraction:** ${mcp.constraints.abstraction_level}
**Verbosity:** ${mcp.constraints.verbosity}
${mcp.constraints.creativity ? `**Creativity vs Precision:** ${mcp.constraints.creativity}` : ""}
${mcp.constraints.length ? `**Target Length:** ${mcp.constraints.length}` : ""}

# 5. COMPOSITION LAYERS
The solution must be composed of the following structural layers:
${mcp.composition.layers.map(l => `- ${l}`).join('\n')}

${mcp.negatives && mcp.negatives.exclude.length > 0 ? `# 6. NEGATIVE PROMPT (AVOID)
Strictly avoid the following tropes, words, and patterns:
${mcp.negatives.exclude.map(n => `- ${n}`).join('\n')}
` : ""}

${mcp.rendering_hints ? `# 7. RENDERING INSTRUCTIONS
Sentence Length: ${mcp.rendering_hints.sentence_length || "Varied"}
Metaphors: ${mcp.rendering_hints.allow_metaphor ? "Allowed" : "Restricted"}
` : ""}
`;
    }
};
