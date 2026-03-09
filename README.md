<h1 align="center"> WalletPulse - Personal Finance Management System</h1>

<p align="center">
  <strong>A modern, full-stack expense tracking application to help you manage your personal finances efficiently</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-blue?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-18.x-green?logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Latest-green?logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Docker-Enabled-blue?logo=docker" alt="Docker"/>
  <img src="https://img.shields.io/badge/Kubernetes-Ready-blue?logo=kubernetes" alt="Kubernetes"/>
</p>

---

## 📌 Project Overview

**WalletPulse** is a comprehensive personal finance management system that enables users to track income and expenses, set budgets, visualize spending patterns through interactive charts, and gain insights into their financial health. Built with modern web technologies and designed for scalability with containerization and Kubernetes deployment support.

###  Key Features

-  **Dashboard Analytics** - Visual overview of income, expenses, and budget status
-  **Expense Tracking** - Categorize and monitor all your expenses
-  **Income Management** - Track multiple income sources
-  **Budget Setting** - Set and monitor budget limits with alerts
-  **Interactive Charts** - Visualize financial data with Line, Bar, and Pie charts
-  **Secure Authentication** - JWT-based user authentication
-  **Responsive Design** - Works seamlessly across all devices
-  **File Uploads** - Attach receipts and documents to transactions

---

## 🏗️ Architecture

WalletPulse follows a modern microservices architecture:

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   React.js      │◄────►│   Express.js     │◄────►│    MongoDB      │
│   Frontend      │      │   REST API       │      │    Database     │
│   (Port 80)     │      │   (Port 3000)    │      │                 │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

- **React.js 18.x** - Modern UI library for building interactive interfaces
- **Vite** - Next-generation frontend build tool
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Recharts** - Composable charting library for data visualization
- **Axios** - Promise-based HTTP client
- **React Router** - Client-side routing

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling
- **JWT** - Secure token-based authentication
- **Multer** - Middleware for handling file uploads
- **bcryptjs** - Password hashing

### DevOps & Deployment

- **Docker** - Container platform for consistent environments
- **Docker Compose** - Multi-container orchestration
- **Kubernetes (K8s)** - Container orchestration and management
- **Azure AKS** - Managed Kubernetes service
- **Azure Container Registry (ACR)** - Private container registry
- **GitHub Actions** - CI/CD automation
- **Nginx** - Web server and reverse proxy

---

##  Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** v14.x or higher
- **npm** or **yarn**
- **MongoDB** (Local installation or MongoDB Atlas account)
- **Git**
- **Docker & Docker Compose** (optional, for containerized deployment)
- **kubectl** (optional, for Kubernetes deployment)

###  Clone the Repository

```bash
git clone https://github.com/erandesamadhan2003/WalletPulse.git
cd WalletPulse
```

---

##  Local Development Setup

### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env` file:**

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=

# JWT Secret
JWT_KEY=

# File Upload
MAX_FILE_SIZE=5242880
```

**Start the backend server:**

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend API will be available at `http://localhost:3000`

### 2️⃣ Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3️⃣ Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended for Local Testing)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Access the application:**

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Manual Docker Build

**Build Backend:**

```bash
cd backend
docker build -t walletpulse-backend .
docker run -p 3000:3000 --env-file .env walletpulse-backend
```

**Build Frontend:**

```bash
cd frontend
docker build -t walletpulse-frontend .
docker run -p 80:80 walletpulse-frontend
```

---

## ☸️ Kubernetes Deployment

### Prerequisites for K8s Deployment

- Azure CLI installed and configured
- kubectl installed
- Access to Azure Kubernetes Service (AKS)
- Azure Container Registry (ACR) credentials

### 1️⃣ Configure Kubernetes Secrets

```bash
cd k8s

# Copy the secrets template
cp secrets-template.yaml secrets.yaml

# Edit secrets.yaml and add your base64-encoded values
# To encode a value: echo -n 'your-value' | base64
```

**Apply secrets:**

```bash
kubectl apply -f secrets.yaml
```

### 2️⃣ Deploy to Kubernetes

```bash
# Apply all Kubernetes manifests
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f backend-hpa.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f ingress.yaml
```

### 3️⃣ Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress

# View pod logs
kubectl logs -f deployment/walletpulse-backend
kubectl logs -f deployment/walletpulse-frontend
```

### 4️⃣ Scale Application

```bash
# Manual scaling
kubectl scale deployment walletpulse-backend --replicas=3
kubectl scale deployment walletpulse-frontend --replicas=3

# HPA (Horizontal Pod Autoscaler) is configured for backend
# It will automatically scale between 2-5 replicas based on CPU usage
```

---

## 🔄 CI/CD Pipeline

The project includes a GitHub Actions workflow for automated CI/CD to Azure AKS.

### Workflow Features

- ✅ Automated Docker image builds on push to `main` branch
- ✅ Push images to Azure Container Registry
- ✅ Automatic deployment to AKS cluster
- ✅ Rolling updates with zero downtime

### Required GitHub Secrets

Configure the following secrets in your GitHub repository:

```
AZURE_CREDENTIALS      # Azure service principal credentials
ACR_NAME              # Azure Container Registry name
RESOURCE_GROUP        # Azure resource group name
AKS_CLUSTER          # AKS cluster name
```

### Trigger Deployment

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The workflow will automatically:

1. Build Docker images with the commit SHA as tag
2. Push images to ACR
3. Update Kubernetes deployments with new images

---

## 📁 Project Structure

```
WalletPulse/
├── backend/                    # Backend API server
│   ├── config/                # Database configuration
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Authentication & upload middleware
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API routes
│   ├── uploads/               # File upload directory
│   ├── server.js              # Application entry point
│   └── Dockerfile             # Backend container definition
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   └── utils/            # Helper functions
│   ├── public/               # Static assets
│   ├── nginx.conf            # Nginx configuration for production
│   └── Dockerfile            # Frontend container definition
│
├── k8s/                       # Kubernetes manifests
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── backend-hpa.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── ingress.yaml
│   └── secrets-template.yaml
│
├── .github/workflows/         # CI/CD workflows
│   └── docker-build.yaml
│
└── docker-compose.yaml        # Local development orchestration
```

---

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Dashboard

- `GET /api/dashboard/overview` - Get financial overview
- `GET /api/dashboard/stats` - Get statistics

### Income

- `POST /api/income` - Add new income
- `GET /api/income` - Get all income records
- `PUT /api/income/:id` - Update income record
- `DELETE /api/income/:id` - Delete income record

### Expenses

- `POST /api/expense` - Add new expense
- `GET /api/expense` - Get all expenses
- `PUT /api/expense/:id` - Update expense
- `DELETE /api/expense/:id` - Delete expense
- `POST /api/expense/budget` - Set budget

---

## 🎨 Features in Detail

### Dashboard

- Real-time financial overview
- Last 30 days expense trends
- Recent transactions list
- Income vs Expense comparison charts

### Expense Management

- Category-based expense tracking
- Budget setting and monitoring
- Expense list with filtering
- Receipt attachment support

### Income Tracking

- Multiple income source management
- Income categorization
- Historical income data
- Visual income trends

---

## 🔐 Environment Variables

### Backend Environment Variables

| Variable    | Description               | Example                                 |
| ----------- | ------------------------- | --------------------------------------- |
| `PORT`      | Backend server port       | `3000`                                  |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/walletpulse` |
| `JWT_KEY`   | Secret key for JWT tokens | `your-secret-key-here`                  |
| `NODE_ENV`  | Environment mode          | `development` or `production`           |

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 📊 Monitoring & Health Checks

The backend includes health check endpoints:

```bash
# Check backend health
curl http://localhost:3000/health
```

Kubernetes liveness and readiness probes are configured to ensure high availability.

---

##  Cost Management for Students (Azure AKS)

**Stop spending when not needed, restart in 7 minutes for interviews!**

### Delete AKS Cluster (Keep Everything Else)

```bash
# Delete the cluster to stop all costs
az aks delete \
  --name walletpulse-cluster \
  --resource-group walletpulse-rg \
  --yes --no-wait
```

**What stays:** Code, GitHub Actions, Docker images in ACR  
**What's deleted:** Worker nodes, load balancers, disks  
**Cost:** $0/month

### Recreate for Interview (7 minutes)

```bash
# 1. Create cluster (~5 min)
az aks create \
  --resource-group walletpulse-rg \
  --name walletpulse-cluster \
  --node-count 2 \
  --attach-acr walletpulseacr

# 2. Connect kubectl
az aks get-credentials \
  --resource-group walletpulse-rg \
  --name walletpulse-cluster

# 3. Deploy app (~1 min)
kubectl apply -f k8s/
```

Your app is live! Images pull from ACR automatically.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Samadhan Erande**

- GitHub: [@erandesamadhan2003](https://github.com/erandesamadhan2003)

---

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on GitHub
- Check existing documentation
- Review logs: `kubectl logs -f deployment/walletpulse-backend`

---

##  Acknowledgments

- React.js community for excellent documentation
- MongoDB for flexible NoSQL database
- Azure for cloud infrastructure
- All open-source contributors

---
