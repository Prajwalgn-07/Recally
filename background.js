// require('dotenv').config();
import historyService from './services/historyService.js';
import aiService from './services/aiService.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "query_history") {
        handleHistoryQuery(message.query, message.timeRange, message.resultCount)
            .then(response => {
                const content = historyService.extractContent(response);
                console.log('Sending response back to popup:', content);
                sendResponse({ success: true, data: content });
            })
            .catch(error => {
                console.error('Error in background:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
});

async function handleHistoryQuery(query, daysAgo, resultCount) {
    try {
        console.group('History Query Debug');
        console.log('Query:', query);
        console.log('Time Range:', daysAgo, 'days');
        console.log('Result Count:', resultCount);
        
        const historyData = await historyService.fetchHistory(
            resultCount,
            daysAgo
        );
        console.log('History Data:', historyData);
        
        const prompt = historyService.formatHistoryForPrompt(historyData, query);
        console.log('Formatted Prompt:', prompt);
        
        const insights = await aiService.getInsights(prompt);
        console.log('AI Insights:', insights);
        console.groupEnd();
        
        return insights;
    } catch (error) {
        console.error('Error in history query handler:', error);
        console.groupEnd();
        throw error;
    }
}