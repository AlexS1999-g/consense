/**
 * Renders a PromptMCP object into a Stable Diffusion / Midjourney style prompt.
 * @param {import('../services/MCPService').PromptMCP} mcp 
 * @returns {{ positive: string, negative: string }}
 */
export const renderForDiffusion = (mcp) => {
    // Construct Positive Prompt
    const subject = mcp.domain.subject;
    const style = mcp.intent.perspective === 'cinematic' ? 'cinematic lighting, 8k, unreal engine 5 render, photorealistic' :
        mcp.intent.perspective === 'technical' ? 'schematic, blueprint, technical drawing, high contrast, clean lines' :
            'highly detailed, masterpiece';

    const elements = mcp.domain.focus.join(", ");
    const tone = mcp.constraints.tone.join(", ");

    const positive = `${subject}, ${style}, ${elements}, ${tone}, ${mcp.intent.primary_goal}`;

    // Construct Negative Prompt
    const defaultNegatives = ["blur", "low quality", "distortion", "watermark"];
    const explicitNegatives = mcp.negatives?.exclude || [];
    const negative = [...defaultNegatives, ...explicitNegatives].join(", ");

    return {
        positive,
        negative
    };
};
