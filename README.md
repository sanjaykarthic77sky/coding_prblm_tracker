# CodeTrack – Coding Problem Tracker 🚀

A full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** web application built for CSE students to log, organize, and monitor coding practice problems from platforms like LeetCode, HackerRank, CodeChef, GeeksforGeeks, and others.

---

## 📌 Project Overview

When preparing for technical interviews and coding contests, tracking practiced problems, patterns, difficulty levels, and key notes is crucial. **CodeTrack** provides a central developer dashboard to:

- 📝 Add and categorize coding practice problems.
- 🔍 Search by title, topic, platform, or notes.
- 🎯 Filter problems simultaneously by Difficulty, Platform, Status, and Topic.
- 📊 Track real-time progress metrics (Total, Solved, Unsolved, Easy, Medium, Hard breakdown, and completion %).
- 🔗 Open problem URLs directly in one click.
- 💡 Maintain personal solution approaches, complexities, and edge cases.
- ⚡ Quickly toggle Solved/Unsolved status.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 (Vite) | Fast, component-based Single Page Application (SPA) |
| **Routing** | React Router v6 | Client-side page navigation without page reload |
| **HTTP Client** | Axios | REST API communication with the backend |
| **Icons** | Lucide React | Clean, lightweight developer dashboard icons |
| **Styling** | Custom CSS3 | Modern dark navy developer theme, responsive design |
| **Backend** | Node.js & Express.js | RESTful API server with modular controllers & routes |
| **Database** | MongoDB & Mongoose | Document-oriented NoSQL database & schema modeling |

---

## 📂 Project Structure

```text
CodeTrack/
│
├── client/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top navigation bar with responsive mobile menu
│   │   │   ├── ProblemCard.jsx     # Reusable card with badges & quick actions
│   │   │   ├── ProblemForm.jsx     # Reusable form for Add & Edit workflows
│   │   │   ├── SearchBar.jsx       # Multi-criteria filter & search toolbar
│   │   │   └── StatsCard.jsx       # Metric summary card for dashboard
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Live stats, progress bar & recent problems
│   │   │   ├── Problems.jsx        # Problem list with search & filters
│   │   │   ├── AddProblem.jsx      # Form to log new coding problems
│   │   │   ├── EditProblem.jsx     # Form to modify existing problems
│   │   │   └── ProblemDetails.jsx  # Detailed view with notes & external link
│   │   │
│   │   ├── services/
│   │   │   └── problemService.js   # Centralized Axios API request methods
│   │   │
│   │   ├── App.jsx                 # Route definitions
│   │   ├── main.jsx                # React root entry point
│   │   └── index.css               # Global theme & developer-dashboard styles
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js                   # Mongoose connection logic
│   │
│   ├── controllers/
│   │   └── problemController.js    # Business logic & CRUD database handlers
│   │
│   ├── models/
│   │   └── Problem.js              # Mongoose Schema & validation
│   │
│   ├── routes/
│   │   └── problemRoutes.js        # Express REST API routes
│   │
│   ├── seed.js                     # Sample dataset seeder script
│   ├── server.js                   # Express server entry point
│   ├── .env.example                # Example environment variables template
│   ├── .env                        # Local environment variables
│   └── package.json
│
├── package.json                    # Root package.json to run both apps
├── .gitignore
└── README.md
```

---

## 🔄 MERN Architecture & Data Flow

```text
[ React UI Component (e.g., Dashboard.jsx) ]
                      │
                      ▼
[ Service Layer: problemService.js (Axios) ]
                      │ HTTP Request (e.g. GET /api/problems)
                      ▼
[ Express Server & Route: problemRoutes.js ]
                      │
                      ▼
[ Controller Logic: problemController.js ]
                      │ Query execution
                      ▼
[ Mongoose Schema: models/Problem.js ]
                      │
                      ▼
[ MongoDB Database (Collection: problems) ]
```

---

## 🗄️ MongoDB Schema Definition

Each problem document contains the following fields:

```javascript
{
  title: String,        // Required, trimmed (e.g. "Two Sum")
  platform: String,     // Required, Enum: ['LeetCode', 'HackerRank', 'CodeChef', 'GeeksforGeeks', 'Other']
  difficulty: String,   // Required, Enum: ['Easy', 'Medium', 'Hard']
  topic: String,        // Required, trimmed (e.g. "Array", "Dynamic Programming")
  status: String,       // Required, Enum: ['Solved', 'Unsolved'], default: 'Unsolved'
  link: String,         // Optional URL string
  notes: String,        // Optional solution notes / complexity breakdown
  createdAt: Date,      // Auto-generated timestamp
  updatedAt: Date       // Auto-generated timestamp
}
```

---

## 🔌 REST API Endpoints

Base URL: `http://localhost:5000/api/problems`

| Method | Endpoint | Description |
|---|---|---|
| **GET** | `/api/problems` | Retrieve all problems (supports `?search=`, `?difficulty=`, `?platform=`, `?status=`, `?topic=`) |
| **GET** | `/api/problems/stats` | Retrieve aggregate metrics (total, solved, unsolved, easy, medium, hard, percentage) |
| **GET** | `/api/problems/:id` | Retrieve single problem details by MongoDB ID |
| **POST** | `/api/problems` | Create a new coding problem |
| **PUT** | `/api/problems/:id` | Update an existing problem |
| **DELETE** | `/api/problems/:id` | Delete a problem by MongoDB ID |
| **PATCH** | `/api/problems/:id/status` | Toggle or update Solved/Unsolved status |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** installed locally (or a free **MongoDB Atlas** connection string)

---

### 2. Installation

Clone or navigate to the project directory:

```bash
cd "coding prblm tracker"
```

Install dependencies for all workspaces:

```bash
# Install root, backend, and frontend dependencies
npm run install-all
```

*(Alternatively, install manually in each folder):*
```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

---

### 3. Environment Variables Configuration

In `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/codetrack
```
> **Note:** If using **MongoDB Atlas**, replace `MONGO_URI` with your connection string:
> `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/codetrack?retryWrites=true&w=majority`

---

### 4. (Optional) Seed Sample Problems

To populate the database with 10 realistic coding problems (Two Sum, Valid Parentheses, Binary Search, etc.):

```bash
npm run seed
```
*(Or `node server/seed.js`)*

---

### 5. Running the Application

You can start both Backend and Frontend together or in separate terminals:

#### Option A: Run Both Together (Recommended)
From the root directory:
```bash
npm run dev
```

#### Option B: Run in Separate Terminals

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
```
> Server runs on: **`http://localhost:5000`**

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
> Client runs on: **`http://localhost:3000`** (or displayed Vite URL)

Open **`http://localhost:3000`** in your browser.

---

## 🎓 Viva / Presentation Highlights for CSE Students

1. **Why MERN Stack?**
   - Single language (JavaScript) across both client and server layers.
   - JSON-native data flow: React sends JSON, Express parses JSON, MongoDB stores BSON/JSON documents.
2. **State Management:**
   - Kept simple and maintainable using standard React hooks (`useState`, `useEffect`, `useMemo`) without over-engineering with Redux.
3. **Optimistic & Live Updates:**
   - Quick status toggles and delete operations update both the backend database and the local React state instantly for a smooth user experience.
4. **Resilience & Validation:**
   - Strict Mongoose schema validations prevent invalid data entries.
   - Comprehensive error banners catch network failures and bad inputs gracefully.

---

## 🔮 Future Enhancements

- 🏷️ Custom tag system (e.g., `#NeetCode150`, `#StriversSDE`).
- ⏱️ Practice timer / stopwatch to measure time taken to solve a problem.
- 📅 Daily streak tracker and revision reminder notifications.
- 📈 Export problems to CSV / Markdown format.
