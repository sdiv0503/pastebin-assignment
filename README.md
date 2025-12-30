# Pastebin Lite

A secure, serverless pastebin application built with **Next.js 15**, **Upstash Redis**, and **Tailwind CSS**. This application allows users to share text content with optional **time-based expiry** and **view-count limits**.

🔗 **Live Demo:** [https://pastebinlite-assignment.vercel.app](https://pastebinlite-assignment.vercel.app)

---

## 🚀 Features

- **Create Pastes:** Store arbitrary text/code with a clean interface.
- **Time-to-Live (TTL):** Set pastes to expire automatically after a specific duration.
- **View Limits:** Set pastes to self-destruct after a specific number of views.
- **Atomic Locking:** Guarantees strict adherence to view limits even under concurrent load using Redis Lua scripts.
- **Deterministic Testing:** Supports time-travel testing via the `x-test-now-ms` header.
- **Modern UI:** Built with Tailwind CSS, featuring copy-to-clipboard and syntax highlighting style.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Upstash Redis (Serverless)
- **Deployment:** Vercel

---

## ⚙️ How to Run Locally

Follow these steps to run the project on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/sdiv0503/pastebin-assignment.git](https://github.com/sdiv0503/pastebin-assignment.git)
   cd pastebin-lite
2. **Install dependencies:**
   ```bash
   npm install
3. **Configure Environment Variables: Create a .env.local file in the root directory and add your Upstash Redis credentials:**
   ```bash
   UPSTASH_REDIS_REST_URL="your_upstash_url"
   UPSTASH_REDIS_REST_TOKEN="your_upstash_token"
# Optional: Set to '1' to enable strict test mode behaviors
# TEST_MODE="1"
4. **Run the development server:**
   npm run dev
5. **Open the app:**  Visit http://localhost:3000 in your browser.

## Architecture & Design Decisions

### Persistence Layer: Upstash Redis

Redis was chosen as the primary database for several key reasons:

- **Performance**: As a key-value lookup system (ID → Content), Redis provides sub-millisecond retrieval times superior to relational databases for this use case
- **Serverless compatibility**: Upstash's HTTP-based driver (@upstash/redis) is stateless and scales perfectly with Next.js serverless functions, avoiding connection pool exhaustion common with standard Redis clients

### Atomic View Counting

**Challenge**: Race conditions with concurrent requests could violate view limits (e.g., two users accessing a paste with `max_views: 1` simultaneously)

**Solution**: Custom Redis Lua script that executes atomically on the server:
- Checks paste existence
- Validates expiration
- Decrements view count in a single operation
- Guarantees strict enforcement even under high concurrency

### Deterministic Time Testing

**Requirement**: Support for automated testing with simulated time progression via `x-test-now-ms` header

**Implementation**: 
- Stores absolute `expires_at` timestamp in JSON payload instead of relying on Redis's native EXPIRE
- API dynamically determines "current time" from either system clock or test header when `TEST_MODE` is active

## API Endpoints

### Health Check
```bash
GET /api/healthz
Returns status 200 if application and database are healthy.

### Create Paste
```bash
   POST /api/pastes
   Content-Type: application/json

   {
   "content": "Your text here",
   "ttl_seconds": 60, // optional
   "max_views": 5 // optional
   }


### Get Paste
```bash
   GET /api/pastes/:id
Returns paste content and metadata. Automatically checks expiry and decrements view count.

## Project Structure

```bash
   ├── src/
   │ ├── app/
   │ │ ├── api/ # Backend API routes
   │ │ ├── p/[id]/ # Paste view page
   │ │ └── page.tsx # Homepage UI
   │ ├── lib/
   │ │ ├── redis.ts # Database connection
   │ │ ├── time.ts # Time helper (handles test headers)
   │ │ └── paste-service.ts # Core business logic + Lua scripts
   │ └── types/ # TypeScript interfaces


## Tech Stack

- **Framework**: Next.js
- **Database**: Upstash Redis
- **Language**: TypeScript
- **Deployment**: Vercel

## License

This project is part of a technical assessment.
