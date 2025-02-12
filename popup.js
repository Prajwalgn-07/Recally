import tokenService from './services/tokenService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveApiKey');
    const queryInput = document.getElementById('queryInput');
    const searchButton = document.getElementById('searchButton');
    const timeRangeSelect = document.getElementById('timeRange');
    const customTimeRangeInput = document.getElementById('customTimeRange');
    const resultCountSelect = document.getElementById('resultCount');
    const customResultCountInput = document.getElementById('customResultCount');
    const resultsDiv = document.getElementById('results');
    const modelSelect = document.getElementById('modelSelect');
    customResultCountInput.style.display = 'none';
    customTimeRangeInput.style.display = 'none';

    resultCountSelect.addEventListener('change', () => {
        customResultCountInput.style.display = resultCountSelect.value === 'custom' ? 'block' : 'none';
    });
    
    timeRangeSelect.addEventListener('change', () => {
        customTimeRangeInput.style.display = timeRangeSelect.value === 'custom' ? 'block' : 'none';
    });

    try {
        const apiKey = await tokenService.getApiKey();
        if (apiKey) {
            apiKeyInput.value = apiKey;
        }

        const model = await tokenService.getModel();
        if (model) {
            modelSelect.value = model;
        }
    } catch (error) {
        console.error('Error loading API key or model:', error);
    }

    saveButton.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        const model = modelSelect.value;
        if (apiKey) {
            try {
                await tokenService.setApiKey(apiKey);
                await tokenService.setModel(model);
            } catch (error) {
                alert('Error saving API key or model: ' + error.message);
            }
        }
    });

    searchButton.addEventListener('click', async () => {
        const query = queryInput.value.trim();
        let resultCount = parseInt(resultCountSelect.value);
        let timeRange = parseInt(timeRangeSelect.value);

        if (resultCountSelect.value === 'custom') {
            const customValue = parseInt(customResultCountInput.value);
            if (!isNaN(customValue) && customValue > 0) {
                resultCount = customValue;
            } else {
                alert('Please enter a valid custom result count.');
                return;
            }
        }

        if (timeRangeSelect.value === 'custom') {
            const customTimeValue = parseInt(customTimeRangeInput.value);
            if (!isNaN(customTimeValue) && customTimeValue > 0) {
                timeRange = customTimeValue;
            } else {
                alert('Please enter a valid custom time range.');
                return;
            }
        }

        if (query) {
            try {
                resultsDiv.innerHTML = 'Loading...';

                chrome.runtime.sendMessage({
                    type: "query_history",
                    query: query,
                    timeRange: timeRange,
                    resultCount: resultCount
                }, response => {
                    if (chrome.runtime.lastError) {
                        resultsDiv.innerHTML = `<p class="error">Error: ${chrome.runtime.lastError.message}</p>`;
                        return;
                    }

                    if (!response) {
                        resultsDiv.innerHTML = '<p class="error">Error: No response received</p>';
                        return;
                    }

                    if (response.error) {
                        resultsDiv.innerHTML = `<p class="error">Error: ${response.error}</p>`;
                    } else if (response.data) {
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
                        resultsDiv.innerHTML = '<p class="error">Error: Invalid response format</p>';
                    }
                });
            } catch (error) {
                resultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            }
        }
    });

    function formatLinks(linksText) {
        const linkMatches = linksText.match(/- .*?: https?:\/\/[^\s]+/g) || [];
        return linkMatches.map(link => {
            const [title, url] = link.replace('- ', '').split(': ');
            return `<li><a href="${url}" target="_blank" title="${title}">${title}</a></li>`;
        }).join('');
    }
});