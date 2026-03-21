export function formatResult(data: any): {
  content: Array<{
    type: "text";
    text: string;
  }>;
} {
  return {
    content: [
      {
        type: "text",
        text: typeof data === "string" ? data : JSON.stringify(data, null, 2),
      },
    ],
  };
}

export function formatError(error: any): {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError: boolean;
} {
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
