// Configuration for the backend API URL
// When running locally, use "http://localhost:5000"
// When using ngrok, replace this with your ngrok HTTPS URL (e.g., "https://xxxx-xx-xx-xx-xx.ngrok-free.app")
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
export const API_BASE_URL = isLocal
    ? "http://localhost:5000"
    : "https://saradhi0515-intelligent-traffic-system-backend.hf.space";
