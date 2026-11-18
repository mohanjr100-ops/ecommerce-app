# Modern Full-Stack E-Commerce Web Application

A full-stack, production-ready E-Commerce application built with React (Vite), Node.js, Express, MongoDB (Mongoose), and Tailwind CSS.

---

## Demo Credentials

The database seeder automatically creates the following accounts:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` | Full access, product CRUD, order management & metrics dashboard |
| **Customer** | `user@example.com` | `user123` | Browse catalog, cart, checkout, view own order history |

---

## Quick Setup & Running

### 1. Backend Setup
```bash
cd server
npm install
npm run seed      # Seeds 1 admin, 1 user, and 10 sample products
npm run dev       # Starts Express backend on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev       # Starts Vite React frontend on http://localhost:5173
```

---

## Complete REST API Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` - Register a new customer
* `POST /api/auth/login` - Authenticate & receive JWT
* `GET /api/auth/me` - [Protected] Fetch current authenticated user

### Product Catalog (`/api/products`)
* `GET /api/products` - List products with search (`?search=`), category filter (`?category=`), and pagination (`?page=&limit=`)
* `GET /api/products/categories` - Distinct product category list
* `GET /api/products/:id` - Single product details
* `POST /api/products` - [Admin] Create a new product
* `PUT /api/products/:id` - [Admin] Update an existing product
* `DELETE /api/products/:id` - [Admin] Remove a product

### Orders & Checkout (`/api/orders`)
* `POST /api/orders` - [Protected] Place order (verifies stock & deducts inventory)
* `GET /api/orders/my` - [Protected] View user's own orders
* `GET /api/orders/:id` - [Protected] View single order detail
* `GET /api/orders` - [Admin] View all platform orders
* `PUT /api/orders/:id/status` - [Admin] Update status (`Pending` → `Shipped` → `Delivered`)

### Admin Dashboard (`/api/admin`)
* `GET /api/admin/stats` - [Admin] Metrics (total revenue, total orders, product count, user count, recent orders)
