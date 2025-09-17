import { marked } from 'marked';

// Basic configuration for marked
marked.setOptions({
  gfm: true, // Use GitHub Flavored Markdown
  breaks: true, // Add <br> on single line breaks
  sanitize: true, // Sanitize HTML to prevent XSS attacks
});

export const parseMarkdown = (markdownText: string): Promise<string> => {
  return marked.parse(markdownText);
};
