export const CONFIG = {
    HISTORY: {
        DEFAULT_MAX_RESULTS: 100,
        SEARCH_WINDOW_DAYS: 30 // You can adjust this to limit history search window
    },
    AI: {
        MODEL: 'gemini-1.5-flash',
        BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
        ENDPOINTS: {
            GENERATE_CONTENT: ':generateContent'
        }
    },
    STORAGE: {
        API_KEY: 'gemini_api_key'
    }
}; 