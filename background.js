require('dotenv').config();

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "query_history") {
        const historyItems = await chrome.history.search({ text: "", maxResults: 100 });

        // Extract relevant history entries
        const data = historyItems.map(item => ({ url: item.url, title: item.title, lastVisit: item.lastVisitTime }));

        // Prepare prompt for LLM
        const prompt = `User Query: ${message.query}\nBrowser History: ${JSON.stringify(data)}\nSummarize and provide insights.`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            sendResponse(result);
        } catch (error) {
            console.error('Fetch error:', error);
            sendResponse({ error: error.message });
        }
    }
    return true;
});