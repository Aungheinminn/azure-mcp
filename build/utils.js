export function formatResult(data) {
    return {
        content: [
            {
                type: "text",
                text: typeof data === "string" ? data : JSON.stringify(data, null, 2),
            },
        ],
    };
}
export function formatError(error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
        content: [
            {
                type: "text",
                text: errorMessage
            },
        ],
        isError: true,
    };
}
