
<h1 align="center">WalletPulse - Expense Management System</h1>

---

## 📌 Project Description

**WalletPulse** is a modern cross-platform expense tracking application built using Flutter. It empowers users to efficiently manage their personal finances by tracking income and expenses, setting budgets, and generating insightful reports.

---

## 🛠️ Technologies Used

### 🌐 Frontend

- **React.js** – For building a dynamic and responsive UI  
- **Tailwind CSS** – For fast and clean UI styling  
- **Electron JS** – For desktop App  

### 🖥️ Backend

- **Node.js** – JavaScript runtime for backend logic  
- **Express.js** – REST APIs and server-side logic  
- **MongoDB** – NoSQL database for storing rooms, code, and chats  

---

## 🧰 Getting Started

To run this project locally after cloning it from GitHub:

### ✅ Prerequisites

Make sure you have:
- Node.js (v14 or higher)
- MongoDB (Local or MongoDB Atlas)
- Git

---

### 📦 Cloning the Repository

```bash
git clone https://github.com/erandesamadhan2003/WalletPulse
cd WalletPulse
```

---

### ⚙️ Set Up Environment Variables

Create a `.env` file inside the `backend/` directory using:

```bash
cd backend
touch .env
```

Then open `.env` and add the following:

```env
MONGO_URI=your_mongodb_url
PORT=3000
JWT_KEY=your_jwt_secret
```

After setting up the `.env` file, install backend dependencies:

```bash
npm install
```

---

### 🖥️ Starting the Backend Server

```bash
npm run dev
```

---

### 💻 Setting Up the Frontend

In a **new terminal window**, run:

```bash
cd frontend
npm install
npm run dev
```

---

### 🌐 Access the App

Open your browser and go to:

```
http://localhost:5173
```

---

## 📎 Additional Notes

- Make sure your MongoDB server is running (or use MongoDB Atlas)  
- Check your terminal/console if you face issues while running the project  

---
