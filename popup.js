import tokenService from './services/tokenService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveApiKey');
    const queryInput = document.getElementById('queryInput');
    const searchButton = document.getElementById('searchButton');
    const timeRange = document.getElementById('timeRange');
    const resultsDiv = document.getElementById('results');
    const modelSelect = document.getElementById('modelSelect');
    const resultCountSelect = document.getElementById('resultCount');
    const customResultCountInput = document.getElementById('customResultCount');

    customResultCountInput.style.display = 'none';

    resultCountSelect.addEventListener('change', () => {
        if (resultCountSelect.value === 'custom') {
            customResultCountInput.style.display = 'block';
        } else {
            customResultCountInput.style.display = 'none';
        }
    });

    try {
        const apiKey = await tokenService.getApiKey();
        if (apiKey) {
            apiKeyInput.value = apiKey;
            console.log('Loaded API key successfully');
        }

        const model = await tokenService.getModel();
        if (model) {
            modelSelect.value = model;
            console.log('Loaded model successfully');
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
                console.log('API Key and model saved:', await tokenService.getApiKey(), await tokenService.getModel());
            } catch (error) {
                alert('Error saving API key or model: ' + error.message);
            }
        }
    });

    searchButton.addEventListener('click', async () => {
        const query = queryInput.value.trim();
        let resultCount = parseInt(resultCountSelect.value);

        if (resultCountSelect.value === 'custom') {
            const customValue = parseInt(customResultCountInput.value);
            if (!isNaN(customValue) && customValue > 0) {
                resultCount = customValue;
            } else {
                alert('Please enter a valid custom result count.');
                return;
            }
        }

        if (query) {
            try {
                resultsDiv.innerHTML = 'Loading...';

                chrome.runtime.sendMessage({
                    type: "query_history",
                    query: query,
                    timeRange: parseInt(timeRange.value),
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