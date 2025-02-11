import { CONFIG } from '../config/constants.js';

class HistoryService {
    async fetchHistory(maxResults, daysAgo) {
        try {
            const startTime = new Date();
            startTime.setDate(startTime.getDate() - daysAgo);

            const historyItems = await chrome.history.search({ 
                text: "", 
                maxResults: maxResults || CONFIG.HISTORY.DEFAULT_MAX_RESULTS, // Fallback if not provided
                startTime: startTime.getTime()
            });
            
            return historyItems.map(item => ({
                url: item.url,
                title: item.title,
                lastVisit: new Date(item.lastVisitTime).toLocaleString()
            }));
        } catch (error) {
            console.error('Error fetching history:', error);
            throw error;
        }
    }

    formatHistoryForPrompt(historyData, userQuery) {
        return {
            contents: [{
                parts: [{
                    text: `User Query: ${userQuery}
Browser History: ${JSON.stringify(historyData, null, 2)}

Please analyze this browser history to find entries specifically related to: "${userQuery}"

Provide your response in two sections:

SUMMARY:
Provide a brief summary of what the user was searching for and what they found, based on their browsing history.

RELEVANT LINKS:
List ONLY the links that are directly related to "${userQuery}". Format each link as:
- [Page Title]: [URL]

Important:
- Only include links that are relevant to "${userQuery}"
- Sort links by relevance
- If no relevant links are found, clearly state that
- Include when these pages were visited (use the lastVisit timestamp)

Keep the response clear and concise, focusing only on information related to the query.`
                }]
            }]
        };
    }

    extractContent(response) {
        try {
            if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
                const text = response.candidates[0].content.parts[0].text;
                
                // Split the response into summary and links sections
                const sections = text.split(/SUMMARY:|RELEVANT LINKS:/i).filter(Boolean);
                
                return {
                    summary: sections[0]?.trim() || 'No summary available',
                    links: sections[1]?.trim() || 'No relevant links found'
                };
            }
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Error extracting content:', error);
            throw new Error('Could not extract content from response');
        }
    }
}

export default new HistoryService();