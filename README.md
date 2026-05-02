# 🛡️ RateGuard

> A Production Grade API Rate Limiting System
> built with MERN Stack — inspired by a real 
> world Error 429 on LeetCode.

![RateGuard Dashboard](./screenshots/dashboard.png)

---

## 🔍 Problem Statement

While using LeetCode, I encountered:
Error 429 — Rate Limit Exceeded!
Sorry but you are sending requests
too fast. Please try again later.
Instead of ignoring it, I researched WHY 
this happens and built a complete solution 
from scratch.

---

## 💡 What is Rate Limiting?

Rate limiting controls how many requests
a user/IP can make in a given time window.
Without Rate Limiting:
User → 1000 requests → Server crashes ❌
With Rate Limiting:
User → 10 requests/min allowed ✅
→ 11th request → BLOCKED → 429 ❌

---

## ⚙️ Algorithm — Sliding Window

RateGuard uses the **Sliding Window Algorithm**
instead of Fixed Window.

### Why Not Fixed Window?
Fixed Window Exploit:
Send 10 requests at 0:59 → Allowed ✅
Send 10 requests at 1:01 → Allowed ✅
= 20 requests in 2 seconds! ❌

### Why Sliding Window?
Always checks LAST 60 seconds
No fixed boundaries
No exploit possible ✅

---

## 🚀 Features

- ✅ Sliding Window Rate Limiting Algorithm
- ✅ IP based independent request counting
- ✅ Tiered API Key System (Free/Pro/Premium)
- ✅ Real time monitoring dashboard
- ✅ Request traffic graph (Recharts)
- ✅ Retry countdown timer
- ✅ Algorithm comparison (Fixed vs Sliding)
- ✅ MongoDB Atlas persistent logging
- ✅ CSV log export
- ✅ Environment based configuration

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| Frontend | React.js + Vite |
| Charts | Recharts |
| HTTP Client | Axios |
| Styling | Inline CSS |

---

## 🏗️ System Architecture
Client (React Dashboard)
↓
Express Server (Node.js)
↓
Middleware (rateLimiter.js) ← HEART ❤️
↓
┌────┴────┐
ALLOW     BLOCK
↓         ↓
Route     429 ❌
Handler
↓
MongoDB Atlas (Logs)
↓
React Dashboard (Live Updates)

---

## 📁 Project Structure
RateGuard/
├── server/
│   ├── middleware/
│   │   └── rateLimiter.js  ← Core Algorithm
│   ├── models/
│   │   ├── RequestLog.js   ← Log Schema
│   │   └── ApiKey.js       ← API Key Schema
│   ├── routes/
│   │   └── api.js          ← API Endpoints
│   └── index.js            ← Entry Point
│
├── client/
│   └── src/
│       └── components/
│           ├── Home.jsx
│           ├── Dashboard.jsx
│           ├── RequestGraph.jsx
│           ├── RequestChart.jsx
│           ├── BlockedList.jsx
│           ├── ApiKeyPanel.jsx
│           └── AlgorithmComparison.jsx
│
└── README.md

---

## 🔑 API Key Tiers

| Tier | Limit | Color |
|------|-------|-------|
| Free | 10 req/min | Green |
| Pro | 50 req/min | Blue |
| Premium | 200 req/min | Gold |

---

## 📦 Installation & Setup

### Prerequisites
Node.js installed
MongoDB Atlas account

### 1. Clone Repository
```bash
git clone https://github.com/YASHWANTHGUNA/rateguard.git
cd rateguard
```

### 2. Setup Backend
```bash
cd server
npm install
```

### 3. Create .env in server/
PORT=3000
MONGO_URI=your_mongodb_atlas_uri
LIMIT=10
WINDOW=60000

### 4. Setup Frontend
```bash
cd client
npm install
```

### 5. Run Development
```bash
# Terminal 1 - Backend
cd server
node index.js

# Terminal 2 - Frontend
cd client
npm run dev
```

### 6. Open Browser
http://localhost:5173

---

## 🧪 Testing Rate Limiter

Open Thunder Client or Postman
GET http://localhost:3000/
Send 11 requests rapidly
11th request → 429 blocked! ❌
Watch dashboard update live!


### Test with API Key:
Header: x-api-key: your-generated-key
Pro key → 50 requests allowed
Premium key → 200 requests allowed

---

## 📊 Dashboard Features

| Section | Description |
|---------|-------------|
| Stats Cards | Total/Allowed/Blocked counts |
| Traffic Graph | Real time request visualization |
| Request Logs | Live log table with timestamps |
| Blocked List | Recent blocked requests |
| API Key Manager | Generate and manage keys |
| Algorithm Comparison | Interactive Fixed vs Sliding demo |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Test endpoint |
| GET | /api/stats | Get request statistics |
| GET | /api/logs | Get recent request logs |
| GET | /api/blocked | Get blocked requests |
| POST | /api/generate-key | Generate new API key |
| GET | /api/keys | Get all API keys |

---

## 🚀 Deployment

- Backend → [Render.com](https://render.com)
- Frontend → [Vercel.com](https://vercel.com)
- Database → MongoDB Atlas

Live Demo → [Your URL here]

---

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Algorithm Comparison
![Algorithm](./screenshots/algorithm.png)

### API Key Manager
![API Keys](./screenshots/apikeys.png)

---

## 🧠 Key Learnings

- HTTP Protocol and Status Codes
- Sliding Window Algorithm implementation
- Express Middleware architecture
- MongoDB Atlas cloud database
- Real time React dashboard
- API Key authentication system
- System design thinking

---

## 👨‍💻 Author

**Yashwanth Guna**
- GitHub: [@YASHWANTHGUNA](https://github.com/YASHWANTHGUNA)

---

## 📄 License

MIT License
