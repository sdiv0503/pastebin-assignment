# Pastebin-Lite

A serverless "Pastebin" clone built with Next.js and Redis. This application allows users to create text pastes with optional expiration times and view limits.

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd pastebin-lite
2. **Install dependencies:**
    ```bash
   npm install
3. **Configure Environment Variables: Create a .env.local file in the root directory and add your Upstash Redis credentials:**
UPSTASH_REDIS_REST_URL="your_url_here"
UPSTASH_REDIS_REST_TOKEN="your_token_here"
4. **Run the development server:**
    ```bash
   npm run dev
Open http://localhost:3000 with your browser.
 