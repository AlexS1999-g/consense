import { MCPTool } from '../MCPTool';
import { DiagnosticService } from '../../DiagnosticService';

export class PromptAnalyzerTool extends MCPTool {
    constructor() {
        super("Prompt Analyzer", "Diagnoses structural gaps, vagueness, and missing constraints in user input.");
    }

    async execute(input, context) {
        // Resolve Input (User Query)
        const query = (typeof input === 'string') ? input : context.userQuery;

        if (!query) throw new Error("Analyzer Tool requires context.userQuery");

        const report = DiagnosticService.analyze(query);

        // Add report to context for downstream tools
        context.diagnostics = report;

        return report;
    }
}
