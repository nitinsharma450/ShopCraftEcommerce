A scalable and secure backend for an e-commerce platform (ShopCraft) built using Node.js, Express, MySQL, and JWT Authentication.
It supports Admin Panel, User Operations, Product Management, Cart System, and Order Processing.

🚀 Features
🔐 Authentication & Authorization
- Admin Signup & Login
- User Signup & Login
- JWT-based authentication
- Role-based access control (Admin & User)
- Protected routes using middleware

🛍️ Product Management (Admin)
Create, update, delete products
Search and filter products
Product category assignment
Product count tracking

📂 Product Categories
Create, update, delete categories
Search & filter categories
Suggest categories

👤 User Management (Admin)
Create, update, delete users
Search users
View user details

🌐 Website APIs (User Side)
Browse products
View product details
Filter/search products
Category-based search

🛒 Cart System
Add to cart
Update cart
Sync cart
View cart

📦 Order Management
Checkout from cart
Buy now functionality
Order tracking
Cancel order

🏗️ Tech Stack
Backend: Node.js, Express.js
Database: MySQL
Authentication: JWT (JSON Web Tokens)
Middleware: Custom Guard Middleware
File Upload: express-fileupload
CORS Handling: cors

shopcraft/
│
├── frontend/          # React Frontend
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── services/
│
├── backend/           # Node.js Backend
│   ├── configs/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   └── database/
│
└── README.md

🔌 API Routes Overview
🛠️ Admin Routes (/api/admin)
🔑 Auth
POST /login
POST /signup

📦 Products
POST /product/create

POST /product/update
POST /product/remove
POST /product/searchAll
POST /product/searchById
POST /product/filter

📂 Categories
POST /product-category/create
POST /product-category/update
POST /product-category/remove
POST /product-category/search

👤 Users
POST /user/create
POST /user/update
POST /user/remove
POST /user/search

🌐 Website Routes (/api/website)
🔑 Auth
POST /signup
POST /login

🛍️ Products
GET /product/detail/:id
GET /product/search/:category
POST /product/filter

🛒 Cart
POST /cart/add
POST /cart/update
POST /cart/search

📦 Orders
POST /cartorder/checkout
POST /purchase/checkout
POST /buynow/checkout

👤 User
POST /user
POST /userprofileupdate
POST /user/myorders
POST /user/cancelorder

🔐 Middleware
AdminGuardMiddleware
Verifies Admin JWT token
Protects admin routes
UserGuardMiddleware
Verifies User JWT token
Protects user routes


🖥️ Setup Instructions

1️⃣ Clone Repository
git clone https://github.com/your-username/shopcraft.git
cd shopcraft

2️⃣ Setup Backend
cd backend
npm install
npm start

3️⃣ Setup Frontend
cd frontend
npm install
npm run dev
Update:

⚙️Environment Variables
Create .env in backend:

PORT=5000
JWT_SECRET=your_user_secret
JWT_ADMIN_SECRET=your_admin_secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=social


📌 Future Improvements
Payment gateway integration (Razorpay/Stripe)
Admin dashboard analytics
AI-based product recommendations
Caching with Redis

Contributions are welcome!
Feel free to fork this repo and submit a PR.

👨‍💻 Author

Nitin Sharma
BTech Full Stack Developer 🚀

⭐ Support

If you like this project, give it a ⭐ on GitHub!
