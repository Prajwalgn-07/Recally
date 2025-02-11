import tokenService from './services/tokenService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveApiKey');
    const queryInput = document.getElementById('queryInput');
    const searchButton = document.getElementById('searchButton');
    const timeRange = document.getElementById('timeRange');
    const resultsDiv = document.getElementById('results');

    // Load existing API key if any
    try {
        const apiKey = await tokenService.getApiKey();
        if (apiKey) {
            apiKeyInput.value = apiKey;
            console.log('Loaded API key successfully');
        }
    } catch (error) {
        console.error('Error loading API key:', error);
    }

    // Save API key
    saveButton.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            try {
                await tokenService.setApiKey(apiKey);
                console.log('API Key saved:', await tokenService.getApiKey());
                alert('API key saved successfully!');
            } catch (error) {
                alert('Error saving API key: ' + error.message);
            }
        }
    });

    function formatLinks(linksText) {
        // Extract URLs and titles using regex
        const linkMatches = linksText.match(/- .*?: https?:\/\/[^\s]+/g) || [];
        
        return linkMatches.map(link => {
            const [title, url] = link.replace('- ', '').split(': ');
            return `<li><a href="${url}" target="_blank" title="${title}">${title}</a></li>`;
        }).join('');
    }

    // Handle search with detailed error logging
    searchButton.addEventListener('click', async () => {
        const query = queryInput.value.trim();
        if (query) {
            try {
                console.group('Search Query Debug');
                console.log('Search Query:', query);
                console.log('Time Range:', timeRange.value, 'days');
                resultsDiv.innerHTML = 'Loading...';

                chrome.runtime.sendMessage({
                    type: "query_history",
                    query: query,
                    timeRange: parseInt(timeRange.value),
                    resultCount: parseInt(document.getElementById('resultCount').value)
                }, response => {
                    console.log('Received response:', response);
                    
                    if (chrome.runtime.lastError) {
                        console.error('Runtime error:', chrome.runtime.lastError);
                        resultsDiv.innerHTML = `<p class="error">Error: ${chrome.runtime.lastError.message}</p>`;
                        return;
                    }

                    if (!response) {
                        console.error('No response received');
                        resultsDiv.innerHTML = '<p class="error">Error: No response received</p>';
                        return;
                    }

                    if (response.error) {
                        console.error('Error in response:', response.error);
                        resultsDiv.innerHTML = `<p class="error">Error: ${response.error}</p>`;
                    } else if (response.data) {
                        console.log('Success response:', response.data);
                        
                        // Format the response sections
                        resultsDiv.innerHTML = `
                            <div class="results-section">
                                <h3>Summary</h3>
                                <div class="summary">${response.data.summary}</div>
                            </div>
                            <div class="results-section">
                                <h3>Relevant Links</h3>
                                <ul class="links-list">
                                    ${formatLinks(response.data.links)}
                                </ul>
                            </div>
                        `;
                    } else {
                        console.error('Invalid response format:', response);
                        resultsDiv.innerHTML = '<p class="error">Error: Invalid response format</p>';
                    }
                });
                
                console.groupEnd();
            } catch (error) {
                console.error('Search error:', error);
                resultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
                console.groupEnd();
            }
        }
    });
});