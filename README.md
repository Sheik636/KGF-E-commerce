# 🛒 Advanced MERN Ecommerce Website

A full-stack advanced ecommerce platform built using the MERN stack with modern UI/UX and production-level features.

---

## 🚀 Features

### 👤 User Features
- User Authentication (JWT)
- Register & Login
- Product Search & Filters
- Add to Cart
- Quantity Update
- Checkout System
- Shipping Address
- Razorpay Payment Integration
- Order History
- Responsive UI

### 🛠 Admin Features
- Admin Dashboard
- Add/Edit/Delete Products
- Image Upload & Crop
- View All Orders
- Mark Orders as Delivered
- Payment Status Tracking

---

## 🧰 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios
- React Toastify
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Razorpay API

---

## 📂 Project Structure

```bash
client/
server/
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <your-github-repo-link>
```

### Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

---

## 🔑 Environment Variables

Create `.env` file inside server folder.

```env
MONGO_URI=your_mongodb_url

JWT_SECRET=your_secret_key

RAZORPAY_KEY_ID=your_key

RAZORPAY_KEY_SECRET=your_secret
```

---

## ▶️ Run Project

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm start
```

---

## 📸 Screenshots

(Add screenshots later)

---

## 🔥 Phase-2 Implemented Features

- ✅ **Product Reviews & Ratings System** (Verified buyer reviews, star rating summary breakdown, interactive star review form).
- ✅ **Promo & Coupon System** (Admin promo code creator, expiration & min purchase validation, checkout discount line items).
- ✅ **Live Order Tracking Timeline** (Multi-stage visual stepper: Placed ➔ Processing ➔ Shipped ➔ Delivered, tracking ID & carrier details).
- ✅ **Order Cancellation & Stock Restoration** (User self-service cancellation for pending orders).
- ✅ **Admin Analytics Dashboard** (Store metrics, revenue charts, category sales distribution, order status breakdown).
- ✅ **Cloud Wishlist Synchronization** (Persisted MongoDB wishlist backend sync for logged-in users).

---

## 👨‍💻 Developer

Built by Sheik Ahamed 🚀