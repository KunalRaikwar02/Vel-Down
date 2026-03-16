import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api/youtube";

/**
 * High-speed parallel fetching of metadata and quality options.
 */
export const fetchVideoDetails = async (url) => {
  try {
    const encodedUrl = encodeURIComponent(url);
    
    // Parallel Execution for Luxe Performance
    const [infoRes, qualRes] = await Promise.all([
      axios.get(`${API_BASE}/info?url=${encodedUrl}`),
      axios.get(`${API_BASE}/qualities?url=${encodedUrl}`)
    ]);

    if (!infoRes.data.success || !qualRes.data.success) {
      throw new Error("One or more nodes failed to respond.");
    }

    return {
      success: true,
      video: infoRes.data.data,
      qualities: qualRes.data.qualities
    };
  } catch (error) {
    const msg = error.response?.data?.message || "System Connection Failed";
    console.error("[API ERROR]:", msg);
    return { success: false, message: msg };
  }
};

/**
 * Generates the final download link
 */
export const getDownloadUrl = (url, itag) => {
  // ✅ Fix: API_BASE ab dynamic hai
  return `${API_BASE}/download?url=${encodeURIComponent(url)}&itag=${itag}`;
};