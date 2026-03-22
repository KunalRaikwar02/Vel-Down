# Vel Down 

Vel Down is a high-performance YouTube extraction tool that delivers a fast, clean, and reliable download experience without interruptions such as bot verification prompts.

## ✨ Overview

Modern YouTube downloaders often fail due to aggressive bot detection systems. Vel Down addresses this by implementing a more robust, authenticated extraction flow to ensure stability and performance.

## 🛠 Tech Stack

**Frontend:** React.js, Tailwind CSS, Lucide Icons
**Backend:** Node.js, Express.js
**Core Engine:** yt-dlp-exec

## ⚙️ Key Features

* 🔐 OAuth2 Device Code Flow authentication
* ⚡ Zero-storage streaming using Node.js subprocess pipelines
* 🎯 Clean resolution mapping (1080p, 720p, 480p)
* 🚫 No popups or intrusive redirects
* 🎨 Premium dark UI (Dark Academia inspired)

## 🧠 How It Works

1. User submits a YouTube URL
2. Backend authenticates request using OAuth2 Device Flow
3. yt-dlp-exec fetches metadata and stream
4. Node.js pipes the stream directly to the client
5. Frontend handles download via Blob URL API

## 🔮 Future Improvements

* Add playlist download support
* Improve mobile responsiveness
* Add format selection (MP3, MP4)
