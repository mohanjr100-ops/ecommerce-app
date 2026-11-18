# 🛍️ ShopVibe — Full-Stack E-Commerce Web Application

A modern, production-grade E-Commerce web application built with **React (Vite)**, **Node.js**, **Express**, **MongoDB (Mongoose)**, and **Tailwind CSS**.

---

## 🌐 Live Web Application & Submission Details

* **GitHub Repository**: [https://github.com/mohanjr100-ops/ecommerce-app](https://github.com/mohanjr100-ops/ecommerce-app)
* **Live Web App**: [https://ecommerce-app-onrender.com](https://dashboard.render.com/web/srv-dbukem9srm7s73f5ipt0) *(Hosted on Render)*

---

## 🔑 Demo Login Credentials

The database includes pre-configured accounts with full role-based permissions:

| Role | Email | Password | Permissions & Features |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` | Full Admin Dashboard, Add/Edit/Delete Products, Manage Orders, Change Status (`Pending` → `Shipped` → `Delivered`), Real-time revenue & order statistics |
| **Customer** | `user@example.com` | `user123` | Browse catalog, live search, category filters, cart management, checkout with COD, track own orders with visual progress bar |

> **Note**: The login screen also includes **1-Click Autofill Demo Buttons** to log in instantly as Admin or Customer!

---

## 🚀 Key Features

### 1. Authentication & Role-Based Authorization
- Customer registration and login using secure **JWT (JSON Web Tokens)** and **bcryptjs** password encryption.
- Role-based middleware (`protect` and `adminOnly`) guarding backend endpoints and React protected routes.

### 2. Product Catalog
- Responsive product grid with **live instant keyword search** and **category filter chips** (Audio, Computers, Displays, Accessories, Wearables, etc.).
- Server-side **pagination** control.
- Product detail page with high-res images, stock indicators, quantity selectors, and real-time stock limits.

### 3. Shopping Cart & Checkout
- Persistent cart state synchronized in `localStorage`.
- Quantity increment/decrement with stock boundary enforcement.
- Complete checkout form: Full Name, Address, City, Postal Code, Phone Number.
- Payment method: **Cash on Delivery (COD)**.
- **Stock Reduction**: Placing an order securely validates inventory and automatically reduces available stock in MongoDB.

### 4. Order Tracking Workflow
- **Customer View**: Track order history with real-time status and interactive 3-step visual delivery timeline:
  $$\text{Pending} \longrightarrow \text{Shipped} \longrightarrow \text{Delivered}$$
- **Admin View**: Comprehensive order table with customer information, purchased item snapshot, and instant status updater.

### 5. Admin Dashboard
- **Store Metrics**: Total Revenue ($), Total Order Count, Live Product Count, and Registered Customer Count.
- **Product Management**: Modal form to Create, Update, and Delete products with immediate catalog sync.
- **Order Management**: Review every platform order and update fulfillment status.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite, React Router 6, Tailwind CSS, Axios, Lucide Icons
* **Backend**: Node.js, Express.js (ES Modules)
* **Database**: MongoDB Atlas with Mongoose ODM
* **Authentication**: JWT & bcryptjs password hashing

---

## 📂 Project Architecture

```text
ecommerce-app/
├── package.json                   # Root deployment orchestration
├── README.md                      # Documentation & demo credentials
├── server/
│   ├── .env                       # Environment configuration
│   ├── server.js                  # Express application entry point
│   ├── config/db.js               # MongoDB Mongoose connection
│   ├── models/                    # User, Product, Order schemas
│   ├── middleware/                # JWT auth, adminOnly, error handler
│   ├── controllers/               # Auth, Product, Order, Admin controllers
│   ├── routes/                    # REST API routes
│   └── seeder/seed.js             # Automated database seeding script
│
└── client/
    ├── vite.config.js             # Vite configuration with API proxy
    ├── tailwind.config.js         # Tailwind styling
    └── src/
        ├── App.jsx                # Router & page layout
        ├── api/axios.js           # Axios client with JWT interceptor
        ├── context/               # AuthContext & CartContext
        ├── components/            # Navbar, Footer, ProductCard, Pagination, ProtectedRoute
        └── pages/                 # Home, Detail, Cart, Checkout, Orders, Login, Register, Admin
```

---

## 💻 Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/mohanjr100-ops/ecommerce-app.git
cd ecommerce-app
```

### 2. Backend Setup
```bash
cd server
npm install
npm run seed       # Seeds 1 admin, 1 user, and 10 sample products
npm run dev        # Starts Express server on http://localhost:5000
```

### 3. Frontend Setup
In a new terminal:
```bash
cd client
npm install
npm run dev        # Starts React Vite client on http://localhost:5173
```
Open **`http://localhost:5173`** in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in user profile |
| `GET` | `/api/products` | Public | List products (with `search`, `category`, `page`) |
| `GET` | `/api/products/categories` | Public | Get distinct categories list |
| `GET` | `/api/products/:id` | Public | Get single product details |
| `POST` | `/api/products` | Admin Only | Create new product |
| `PUT` | `/api/products/:id` | Admin Only | Update existing product |
| `DELETE` | `/api/products/:id` | Admin Only | Delete product |
| `POST` | `/api/orders` | Protected | Place new order & decrement stock |
| `GET` | `/api/orders/my` | Protected | Get authenticated user's order history |
| `GET` | `/api/orders/:id` | Protected | Get single order details |
| `GET` | `/api/orders` | Admin Only | Get all orders across the store |
| `PUT` | `/api/orders/:id/status` | Admin Only | Update delivery status (`Pending`/`Shipped`/`Delivered`) |
| `GET` | `/api/admin/stats` | Admin Only | Store dashboard analytics (revenue, order counts, etc.) |
