# 🏗️ Praktikum Software Construction — Microservices Architecture

Aplikasi full-stack berbasis **microservices** yang dibangun menggunakan **React**, **Node.js/Express**, **Laravel**, dan **Nginx** sebagai API Gateway. Seluruh service di-*orchestrate* menggunakan **Docker Compose**.

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Nginx API Gateway (:8000)                  │
│  ┌────────────┬──────────────┬────────────────────────┐ │
│  │  Frontend  │  /api/auth   │  /api/users            │ │
│  │  (React)   │  /api/products  /api/transactions     │ │
│  └────────────┴──────────────┴────────────────────────┘ │
└────────┬──────────────┬──────────────┬──────────────────┘
         │              │              │
         ▼              ▼              ▼
┌──────────────┐ ┌─────────────┐ ┌──────────────────┐
│ Auth Service │ │   Product   │ │   Transaction    │
│ (Express.js) │ │   Service   │ │     Service      │
│   :3001      │ │  (Laravel)  │ │   (Express.js)   │
│   SQLite     │ │   :8000     │ │     :3000        │
└──────────────┘ │   SQLite    │ │     SQLite       │
                 └─────────────┘ └──────────────────┘
```

### Service Communication

| Flow | Description |
|------|-------------|
| **Gateway → Auth** | Validasi token JWT via `auth_request` di Nginx |
| **Product → Auth** | Horizontal fetch user data (owner) via HTTP internal |
| **Transaction → Auth** | Horizontal fetch user & product data via HTTP internal |

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, TailwindCSS 4, React Router, React Query (TanStack), Axios |
| **API Gateway** | Nginx (reverse proxy + static file serving) |
| **Auth Service** | Node.js, Express.js, Sequelize (SQLite), JWT |
| **Product Service** | PHP 8, Laravel 11, Eloquent (SQLite) |
| **Transaction Service** | Node.js, Express.js, Sequelize (SQLite) |
| **Containerization** | Docker, Docker Compose |

---

## 📁 Project Structure

```
.
├── Dockerfile                  # Multi-stage: build React + serve via Nginx
├── docker-compose.yml          # Orchestration for all services
├── nginx/
│   └── nginx.conf              # API Gateway routing configuration
├── frontend/                   # React SPA
│   └── src/
│       ├── api/axios.js        # Axios instance with auth interceptor
│       ├── context/            # AuthContext (login, register, logout)
│       ├── components/         # Reusable components (PrivateRoute)
│       ├── hooks/              # React Query hooks (CRUD operations)
│       ├── layouts/            # MainLayout with sidebar navigation
│       └── pages/              # Dashboard, Users, Products, Transactions
├── backend/
│   ├── auth-service/           # Express.js — Authentication & User management
│   │   └── src/
│   │       ├── controllers/    # auth-controller, user-controller
│   │       ├── middleware/     # auth-middleware, role-middleware
│   │       ├── repository/    # Sequelize models & connection
│   │       ├── routes/        # auth-routes, user-routes
│   │       └── utils/         # Response helper
│   ├── product-service/        # Laravel — Product CRUD
│   │   └── app/
│   │       ├── Http/Controllers/
│   │       ├── Interfaces/    # Service & Repository contracts
│   │       ├── Models/        # Product model
│   │       ├── Repositories/  # Eloquent implementations
│   │       └── Services/      # Business logic + horizontal fetch
│   └── transaction-service/    # Express.js — Transaction processing
│       └── src/
│           ├── controllers/
│           ├── middleware/
│           ├── repository/
│           ├── routes/
│           └── services/
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Node.js 22+](https://nodejs.org/) (for local development only)
- [PHP 8+](https://www.php.net/) & [Composer](https://getcomposer.org/) (for local development only)

### Run with Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd "Praktikum Software Construction"

# Build and start all services
docker-compose up --build -d

# Check running containers
docker ps

# View logs
docker-compose logs -f
```

Aplikasi akan berjalan di **http://localhost:8000**

### Stop Services

```bash
docker compose down
```

---

## 🌐 API Endpoints

### Auth Service (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register user baru |
| `POST` | `/api/auth/login` | ❌ | Login & mendapatkan JWT token |
| `GET` | `/api/auth/validate` | 🔒 | Validasi token (internal, digunakan Nginx) |

### User Service (`/api/users`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/users/me` | 🔒 | Any | Get current user info |
| `GET` | `/api/users` | 🔒 | Any | List semua users |
| `GET` | `/api/users/:id` | 🔒 | Any | Get user by ID |
| `POST` | `/api/users/create` | 🔒 | Admin | Create user baru |
| `PUT` | `/api/users/:id/update` | 🔒 | Admin | Update user |
| `DELETE` | `/api/users/:id/delete` | 🔒 | Admin | Delete user |

### Product Service (`/api/products`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/products` | 🔒 | List semua products (+ owner data) |
| `POST` | `/api/products` | 🔒 | Create product baru |
| `GET` | `/api/products/:id` | 🔒 | Get product by ID |
| `PATCH` | `/api/products/:id` | 🔒 | Update product |
| `DELETE` | `/api/products/:id` | 🔒 | Delete product |

### Transaction Service (`/api/transactions`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/transactions` | 🔒 | List semua transactions |
| `POST` | `/api/transactions` | 🔒 | Create transaction baru |
| `GET` | `/api/transactions/:id` | 🔒 | Get transaction by ID |

> 🔒 = Membutuhkan header `Authorization: Bearer <token>`

---

## 🔐 Authentication Flow

1. User melakukan **login/register** via `/api/auth/login` atau `/api/auth/register`
2. Server mengembalikan **JWT token**
3. Token disimpan di `localStorage` oleh frontend
4. Setiap request ke protected route, Axios interceptor otomatis menambahkan header `Authorization: Bearer <token>`
5. Nginx melakukan **`auth_request`** ke `/auth/validate` untuk memvalidasi token sebelum meneruskan request ke Product/Transaction service
6. Jika token invalid/expired, frontend redirect ke halaman login

---

## 🛣️ Nginx Gateway Routing

| Path | Upstream | Auth Check |
|------|----------|-----------|
| `/` | Static React files | ❌ |
| `/api/auth/*` | `auth_service:3001/auth` | ❌ |
| `/api/users/*` | `auth_service:3001/users` | ❌ (handled by service) |
| `/api/products/*` | `product_service:8000/api/products` | ✅ `auth_request` |
| `/api/transactions/*` | `transaction_service:3000/transactions` | ✅ `auth_request` |

---

## 🪝 Frontend React Query Hooks

Semua API calls di-wrap dalam custom hooks menggunakan **TanStack React Query**:

| Hook | Type | Description |
|------|------|-------------|
| `useGetUsers` | Query | Fetch list users |
| `useCreateUser` | Mutation | Create user baru |
| `useUpdateUser` | Mutation | Update user |
| `useDeleteUser` | Mutation | Delete user |
| `useGetProducts` | Query | Fetch list products |
| `useCreateProduct` | Mutation | Create product baru |
| `useUpdateProduct` | Mutation | Update product |
| `useDeleteProduct` | Mutation | Delete product |
| `useGetTransactions` | Query | Fetch list transactions |
| `useCreateTransaction` | Mutation | Create transaction (+ invalidate products) |

---

## 🐳 Docker Services & Ports

| Service | Internal Port | External Port | Image |
|---------|:-------------|:-------------|-------|
| **Gateway** (Nginx + React) | 80 | **8000** | `nginx:alpine` |
| **Auth Service** | 3001 | 3001 | `node:22-alpine` |
| **Transaction Service** | 3000 | 3000 | `node:22-alpine` |
| **Product Service** | 8000 | 8001 | `php:8-apache` |

---

## 📝 Default Seeder

### Auth Service
Seeder otomatis membuat user default saat service pertama kali start.

### Product Service
```php
Product::create([
    "name" => "buku",
    "description" => "buku tulis",
    "stock" => 10,
    "price" => 3000,
    "user_id" => 1
]);
```

---

## 🧪 Development Tips

```bash
# Rebuild specific service
docker-compose up --build -d auth_service

# View logs for specific service
docker-compose logs -f product_service

# Exec into container
docker exec -it praktikumsoftwareconstruction-auth_service-1 sh

# Frontend development (outside Docker)
cd frontend
npm install
npm run dev
```

---

## 👥 Contributors

Praktikum Software Construction

---
