import axios from 'axios';

export const API_BASE = "http://localhost:5000/api/youtube";

/**
 * Fetches video metadata and available qualities from the backend.
 * Uses parallel requests for better performance.
 */
export const fetchVideoDetails = async (url) => {
    try {
        const encodedUrl = encodeURIComponent(url);
        
        // Parallel execution of info and qualities endpoints
        const [infoRes, qualRes] = await Promise.all([
            axios.get(`${API_BASE}/info?url=${encodedUrl}`),
            axios.get(`${API_BASE}/qualities?url=${encodedUrl}`)
        ]);

        if (infoRes.data.success && qualRes.data.success) {
            return { 
                success: true, 
                video: infoRes.data.data, 
                qualities: qualRes.data.qualities 
            };
        }
        
        return { success: false, message: "Could not fetch data" };
    } catch (error) {
        return { success: false, message: "Server connection failed" };
    }
};