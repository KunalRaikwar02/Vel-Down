# VEL DOWN - High Fidelity Video Archiver

VEL DOWN is a high performance, secure web utility engineered for modern video extraction. Built with a focus on privacy and precision, it provides a seamless environment for fetching YouTube content in multiple resolutions without intrusive ads, trackers, or watermarks.

---

## Core Features

* **High Fidelity Extraction:** Fetch videos in various qualities including 1080p, 720p, and 480p.
* **Secure Blob Downloads:** Background processing ensures downloads start instantly without opening unwanted browser tabs.
* **Luxe Interface:** A minimalist, premium UI with native Tailwind CSS animations and a fully responsive layout.
* **Privacy First:** No data logging or user tracking. Pure extraction for creators.
* **Adaptive Theme:** Full support for high contrast Dark and Light modes.

---

## Technical Architecture

### Frontend Layer
* **React.js:** Component based UI architecture for scalability.
* **Tailwind CSS:** Utility first styling with custom "Luxe" design tokens and smooth transitions.
* **Lucide React:** Consistent and clean vector iconography.
* **Axios:** Optimized asynchronous API communication.

### Backend Infrastructure
* **Node.js & Express:** Robust server side logic and routing.
* **Ytdl Core:** Advanced YouTube stream handling and metadata parsing.
* **CORS & Middleware:** Secure cross origin resource sharing and request handling.

---

## API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/youtube/info` | GET | Fetches video metadata and available qualities. |
| `/api/youtube/download` | GET | Initiates the video stream for high speed download. |

---

## Governance and Security

* **Encrypted Handshake:** All internal API calls are handled via secure headers.
* **No Watermarks:** Direct extraction from official sources ensures original quality.
* **Sanitized Filenames:** Automatic removal of special characters for cross-OS compatibility.
* **Zero Logging:** Privacy-centric architecture with no user data retention.
