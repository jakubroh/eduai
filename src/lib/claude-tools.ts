export type ContentType = "code" | "math" | "text" | "translate" | "summary";

export async function processContent(content: string, type: ContentType) {
  switch (type) {
    case "code":
      return `Analyzuj následující kód a vysvětli, co dělá. Pokud najdeš chyby nebo možná vylepšení, navrhni je:\n\n${content}`;
    
    case "math":
      return `Řeš následující matematický problém krok po kroku. Vysvětli každý krok:\n\n${content}`;
    
    case "translate":
      return `Přelož následující text do češtiny a vysvětli případné kulturní rozdíly nebo idiomy:\n\n${content}`;
    
    case "summary":
      return `Vytvoř stručné shrnutí následujícího textu, zachyť hlavní myšlenky a klíčové body:\n\n${content}`;
    
    default:
      return content;
  }
}

export function formatResponse(response: string, type: ContentType) {
  switch (type) {
    case "code":
      return response.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (_, lang, code) => {
        return `<pre><code class="language-${lang || 'text'}">${code}</code></pre>`;
      });
    
    case "math":
      return response.replace(/\$\$(.*?)\$\$/g, (_, math) => {
        return `<div class="math-display">${math}</div>`;
      });
    
    case "translate":
    case "summary":
    default:
      return response;
  }
} 