/**
 * Standard interface for an MCP Tool in Consense.
 */
export class MCPTool {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    /**
     * @param {any} input 
     * @param {any} context 
     * @returns {Promise<any>}
     */
    async execute(input, context) {
        throw new Error("Method 'execute' must be implemented.");
    }
}
