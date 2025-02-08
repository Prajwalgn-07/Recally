import { CONFIG } from '../config/constants.js';
import tokenService from './tokenService.js';

class AiService {
    constructor() {
        this.baseUrl = CONFIG.AI.BASE_URL;
        this.model = CONFIG.AI.MODEL;
    }

    async getInsights(prompt) {
        try {
            debugger; // This will pause execution when DevTools is open
            const apiKey = await tokenService.getApiKey();
            
            if (!apiKey) {
                throw new Error('API key not found. Please set up your API key first.');
            }

            const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${apiKey}`;
            
            debugger; // Will pause before making the API call
            console.log('Request URL:', url);
            console.log('Request Body:', prompt);

            const response = await fetch(url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(prompt)
            });

            debugger; // Will pause after getting the response
            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Response:', errorData);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
            }

            const result = await response.json();
            console.log('API Success Response:', result);
            return result;
        } catch (error) {
            debugger; // Will pause if there's an error
            console.error('AI Service error:', error);
            throw error;
        }
    }
}

export default new AiService(); 