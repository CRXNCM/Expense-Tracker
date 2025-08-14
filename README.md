# 🎯 ExpenseTracker - Full-Stack Personal Finance Management

![Project Banner](https://img.shields.io/badge/ExpenseTracker-Live%20Demo-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

A comprehensive full-stack expense tracking application that helps you manage your personal finances with ease. Track expenses, monitor income, plan meals, and gain insights into your spending habits.

## 🚀 Live Demo
[Coming Soon - Deployed version will be available here]

## ✨ Features

### 💰 **Financial Management**
- **Expense Tracking** - Log and categorize daily expenses
- **Income Management** - Track multiple income sources
- **Fixed Expenses** - Manage recurring bills and subscriptions
- **Daily Logs** - Comprehensive daily financial overview

### 📊 **Analytics & Insights**
- **Dashboard Overview** - Visual financial summary
- **Spending Analytics** - Category-wise expense breakdown
- **Income vs Expense** - Monthly financial health check
- **Trend Analysis** - Historical spending patterns

### 🍽️ **Meal Planning**
- **Weekly Meal Plans** - Plan your meals in advance
- **Grocery Budgeting** - Track meal-related expenses
- **Nutrition Tracking** - Monitor dietary habits

### 👥 **User Management**
- **Multi-user Support** - Individual user accounts
- **Role-based Access** - Admin and user roles
- **Profile Management** - Customizable user profiles
- **Secure Authentication** - JWT-based security

### 📱 **Modern UI/UX**
- **Responsive Design** - Works on all devices
- **Dark/Light Theme** - Personalized experience
- **Real-time Updates** - Live data synchronization
- **Interactive Charts** - Visual data representation

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication & authorization
- **Multer** - File upload handling

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development server
- **Concurrently** - Multi-script runner

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/CRXNCM/Expense-Tracker.git
cd Expense-Tracker

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env file with your MongoDB URI and JWT secret

# Start the development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend/expense-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🗂️ Project Structure

```
Expense-Tracker/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── uploads/        # User uploaded files
│   └── server.js       # Entry point
├── frontend/
│   ├── expense-tracker/
│   │   ├── src/
│   │   │   ├── components/     # Reusable components
│   │   │   ├── pages/         # Page components
│   │   │   ├── context/       # React context
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── services/      # API services
│   │   │   └── utils/         # Utility functions
│   │   └── public/            # Static assets
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Income
- `GET /api/income` - Get all income sources
- `POST /api/income` - Add new income
- `PUT /api/income/:id` - Update income
- `DELETE /api/income/:id` - Delete income

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary
- `GET /api/dashboard/analytics` - Get analytics data

## 🎯 Usage Guide

### Getting Started
1. **Register an account** or **login** with existing credentials
2. **Set up your profile** with basic information
3. **Add your first expense** using the expense form
4. **Track your income** sources for complete financial picture
5. **Explore the dashboard** for insights and analytics

### Key Features Walkthrough
- **Dashboard**: Get a complete overview of your finances
- **Expenses**: Add, edit, and categorize your spending
- **Income**: Track all your income sources
- **Daily Logs**: Comprehensive daily financial records
- **Meal Plans**: Plan and budget your meals
- **Settings**: Customize your experience

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
```bash
# Build commands for production
npm run build
npm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build
```

### Environment Setup
- **MongoDB Atlas** for cloud database
- **Cloudinary** for image storage
- **Render/Heroku** for backend hosting
- **Vercel/Netlify** for frontend hosting

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📈 Roadmap

- [ ] **Mobile App** - React Native mobile application
- [ ] **AI Insights** - Machine learning for spending predictions
- [ ] **Budget Goals** - Set and track financial goals
- [ ] **Bill Reminders** - Automated bill payment reminders
- [ ] **Multi-currency Support** - International currency support
- [ ] **Bank Integration** - Automatic transaction import

## 🐛 Bug Reports & Feature Requests

If you find a bug or have a feature request, please open an issue on our [GitHub Issues](https://github.com/CRXNCM/Expense-Tracker/issues) page.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for better personal finance management
- Thanks to all contributors and users

## 📞 Support

For support, email comradencm@gmail.com or call 0925254765.
We are here to help you with any questions or issues you may have.

---

<div align="center">
  <p>Built with ❤️ by the ExpenseTracker Team</p>
  <p><a href="https://github.com/CRXNCM/Expense-Tracker">⭐ Star this repository</a></p>
</div>
