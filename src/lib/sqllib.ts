export async function executeSQL(query: string) {
  const res = await fetch("/api/ExecuteSQL", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });
    return await res.json();
}

export function isSQLQuery(text: string): boolean {
    
    const sqlKeywords = ['SELECT'];
    const upperText = text.toUpperCase();
    console.log("Text:", upperText);
    
    return sqlKeywords.some(keyword => upperText.startsWith(keyword));
  }

