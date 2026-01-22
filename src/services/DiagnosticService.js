export const DiagnosticService = {
    /**
     * Analyzes user input for structural gaps before expansion.
     * @param {string} input 
     * @returns {Object} DiagnosticReport
     */
    analyze: (input) => {
        const issues = [];
        const lower = input.trim().toLowerCase();
        const wordCount = lower.split(/\s+/).length;

        // 1. Goal/Action Detection
        // Does the user say what they want to DO?
        const hasAction = /create|build|write|generate|make|design|draft|outline|explain|analyze|code|refactor|debug/.test(lower);
        if (!hasAction) {
            issues.push("MISSING_ACTION_VERB");
        }

        // 2. Format/Output Constraint
        // Does the user specify HOW it should look?
        const hasFormat = /code|json|markdown|list|table|essay|email|script|html|react|python|text|summary/.test(lower);
        if (!hasFormat) {
            issues.push("MISSING_OUTPUT_FORMAT");
        }

        // 3. Ambiguity / Vagueness
        if (wordCount < 3) {
            issues.push("EXTREMELY_VAGUE");
        } else if (wordCount < 6) {
            issues.push("POTENTIALLY_AMBIGUOUS");
        }

        // 4. Audience/Context
        const hasContext = /for|target|audience|measure|user|client|customer|team/.test(lower);
        if (!hasContext) {
            issues.push("MISSING_CONTEXT_AUDIENCE");
        }

        // Strategy Recommendation
        let strategy = "Direct expansion";
        if (issues.includes("EXTREMELY_VAGUE")) {
            strategy = "Creative inference required. Assume standard persona defaults.";
        } else if (issues.includes("MISSING_ACTION_VERB")) {
            strategy = "Infer action based on subject (e.g. 'cat' -> 'Explain what a cat is' or 'Generate a cat image prompt').";
        }

        return {
            timestamp: new Date().toISOString(),
            input_length: wordCount,
            detected_issues: issues,
            health_score: Math.max(0, 100 - (issues.length * 20)),
            strategy_hint: strategy
        };
    }
};
