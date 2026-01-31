
export function safeParseJson(jsonText, fallback = {}) {
    if (!jsonText || typeof jsonText !== "string") return fallback;
    try {
        return JSON.parse(jsonText);
    } catch {
        return fallback;
    }
}