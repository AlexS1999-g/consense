export class MCPPipeline {
    constructor() {
        this.tools = [];
    }

    addTool(tool) {
        this.tools.push(tool);
        return this;
    }

    /**
     * Executes the tools in sequence.
     * @param {Object} initialInput 
     * @param {Object} context 
     */
    async execute(initialInput, context) {
        let currentInput = initialInput;

        console.log("Starting MCP Pipeline...", context);

        for (const tool of this.tools) {
            console.log(`Running Tool: ${tool.name}`);
            try {
                // Tools can return modified input or just update context
                // If a tool returns a value, it becomes the input for the next tool (if applicable)
                // However, our tools affect different parts (MCP vs Diagnostics vs Text).
                // So we rely heavily on shared `context`.
                const result = await tool.execute(currentInput, context);

                // If result is returned, it effectively becomes the "current state"
                // But for specific tools like Rewriter, it returns the Final Draft.
                currentInput = result;
            } catch (e) {
                console.error(`Tool ${tool.name} failed:`, e);
                throw e;
            }
        }

        console.log("Pipeline Complete.");
        return currentInput;
    }
}
