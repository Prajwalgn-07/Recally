import { CONFIG } from '../config/constants.js';
import tokenService from './tokenService.js';

class AiService {
    constructor() {
        this.baseUrl = CONFIG.AI.BASE_URL;
    }

    async getInsights(prompt) {
        try {
            debugger;
            const apiKey = await tokenService.getApiKey();
            const model = await tokenService.getModel();
            
            if (!apiKey) {
                throw new Error('API key not found. Please set up your API key first.');
            }

            if (!model) {
                throw new Error('Model not found. Please select a model first.');
            }

            const url = `${this.baseUrl}/models/${model}:generateContent?key=${apiKey}`;
            debugger;
            console.log('Request URL:', url);
            console.log('Request Body:', prompt);

            const response = await fetch(url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(prompt)
            });

            debugger;
            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Response:', errorData);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
            }

            const result = await response.json();
            console.log('API Success Response:', result);
            return result;
        } catch (error) {
            debugger;
            console.error('AI Service error:', error);
            throw error;
        }
    }
}

export default new AiService();