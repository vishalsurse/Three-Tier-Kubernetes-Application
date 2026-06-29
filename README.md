# Three-Tier-Kubernetes-Application


## Project Overview

This project demonstrates deployment of a **Three-Tier Application** on Kubernetes using **Minikube**.

The application consists of:

* **Frontend** → HTML + JavaScript served using Nginx
* **Backend** → Node.js + Express API
* **Database** → PostgreSQL with Persistent Storage

The goal of this project is to:

* Deploy Database
* Deploy Backend Application
* Expose APIs
* Deploy Frontend UI
* Bind Frontend with Backend
* Store user data in PostgreSQL
* Automate Daily Database Backup

---

# Architecture Diagram

```bash
+------------------+
|    Frontend      |
| (Nginx + HTML)   |
| NodePort: 31548  |
+--------+---------+
         |
         | HTTP Request
         v
+------------------+
|    Backend API   |
| (Node.js/Express)|
| NodePort: 31820  |
+--------+---------+
         |
         | SQL Queries
         v
+------------------+
|    PostgreSQL    |
|  Persistent DB   |
|   Port: 5432     |
+------------------+
```

---

# Project Structure

```bash
three-tier-k8s-project/
│
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── Dockerfile
│   ├── backend-deployment.yaml
│   └── backend-service.yaml
│
├── frontend/
│   ├── index.html
│   ├── Dockerfile
│   ├── frontend-deployment.yaml
│   └── frontend-service.yaml
│
├── database/
│   ├── postgres-secret.yaml
│   ├── postgres-pvc.yaml
│   ├── postgres-statefulset.yaml
│   └── postgres-service.yaml
│
└── backup/
    └── db-backup.sh
```

---

# Tech Stack

* Kubernetes
* Minikube
* Docker
* Node.js
* Express.js
* PostgreSQL
* HTML
* JavaScript
* Nginx

---

# Setup Steps

## Step 1: Create Namespace

```bash
kubectl create namespace three-tier
```

---

## Step 2: Deploy PostgreSQL

### Create Secret

```bash
kubectl apply -f database/postgres-secret.yaml
```

### Create Persistent Volume Claim

```bash
kubectl apply -f database/postgres-pvc.yaml
```

### Deploy PostgreSQL StatefulSet

```bash
kubectl apply -f database/postgres-statefulset.yaml
```

### Expose PostgreSQL Service

```bash
kubectl apply -f database/postgres-service.yaml
```

Check:

```bash
kubectl get pods -n three-tier
```

---

## Step 3: Deploy Backend

Install dependencies:

```bash
cd backend
npm install
npm install cors
```

Build backend image:

```bash
eval $(minikube docker-env)
docker build -t backend:v1 .
```

Deploy backend:

```bash
kubectl apply -f backend/backend-deployment.yaml
kubectl apply -f backend/backend-service.yaml
```

Check:

```bash
kubectl get pods -n three-tier
```

---

# Backend APIs

## GET /users

Fetch all users.

```bash
curl http://localhost:8081/users
```

---

## POST /users

Add new user.

```bash
curl -X POST http://localhost:8081/users \
-H "Content-Type: application/json" \
-d '{"name":"Ali","email":"ali@gmail.com"}'
```

---

## Step 4: Deploy Frontend

Build frontend image:

```bash
cd frontend
eval $(minikube docker-env)
docker build -t frontend:v1 .
```

Deploy frontend:

```bash
kubectl apply -f frontend/frontend-deployment.yaml
kubectl apply -f frontend/frontend-service.yaml
```

Check:

```bash
kubectl get pods -n three-tier
```

---

# Application Access

## Frontend

```bash
http://<VM-IP>:31548
```

## Backend API

```bash
http://<VM-IP>:31820/users
```

Get VM IP:

```bash
hostname -I
```

---

# Database Backup

Create backup script:

```bash
mkdir backup
vi backup/db-backup.sh
```

Script:

```bash
#!/bin/bash
kubectl exec -n three-tier postgres-0 -- pg_dump -U devops appdb > backup_$(date +%F).sql
```

Make executable:

```bash
chmod +x backup/db-backup.sh
```

Run manually:

```bash
./backup/db-backup.sh
```

---

# Automate Daily Backup

Open crontab:

```bash
crontab -e
```

Add:

```bash
0 2 * * * /home/centos/three-tier-k8s-project/backup/db-backup.sh
```

This will take backup daily at **2:00 AM**.

---

# Challenges Faced

### 1. ErrImageNeverPull

**Issue:** Kubernetes could not find images.

**Solution:** Built Docker images inside Minikube environment.

---

### 2. PostgreSQL Authentication Failed

**Issue:** Backend could not connect to PostgreSQL.

**Solution:** Updated DB credentials in backend to match PostgreSQL secret.

---

### 3. Frontend Showing Default Nginx Page

**Issue:** Custom UI was not loading.

**Solution:** Rebuilt frontend image and restarted deployment.

---

# Final Result

Successfully implemented:

* Database Deployment
* Backend API Deployment
* Frontend Deployment
* API Exposure
* Frontend-Backend Integration
* PostgreSQL Data Storage
* Automated Daily Backup

---

# Verification Commands

```bash
kubectl get pods -n three-tier
kubectl get svc -n three-tier
kubectl logs deployment/backend -n three-tier
kubectl logs deployment/frontend -n three-tier
curl http://localhost:8081/users
```

