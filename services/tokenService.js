import { CONFIG } from '../config/constants.js';

class TokenService {
    async getApiKey() {
        try {
            const result = await chrome.storage.sync.get([CONFIG.STORAGE.API_KEY]);
            return result[CONFIG.STORAGE.API_KEY];
        } catch (error) {
            console.error('Error fetching API key:', error);
            throw error;
        }
    }

    async setApiKey(apiKey) {
        try {
            await chrome.storage.sync.set({ [CONFIG.STORAGE.API_KEY]: apiKey });
        } catch (error) {
            console.error('Error saving API key:', error);
            throw error;
        }
    }

    async removeApiKey() {
        try {
            await chrome.storage.sync.remove([CONFIG.STORAGE.API_KEY]);
        } catch (error) {
            console.error('Error removing API key:', error);
            throw error;
        }
    }
}

export default new TokenService(); 