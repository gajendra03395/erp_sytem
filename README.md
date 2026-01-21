# Dongkwang Precision India Pvt Ltd - Manufacturing ERP System

[![ERP System](https://img.shields.io/badge/ERP-Manufacturing-blue?style=for-the-badge&logo=next.js&logoColor=white)](https://dongkwang-precision-india.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2FF?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> 🏭 **Complete Manufacturing ERP System** built for Dongkwang Precision India Pvt Ltd  
> A modern, responsive, and feature-rich Enterprise Resource Planning solution

## 🌟 **Live Demo**

**🔗 [https://dongkwang-precision-india.vercel.app](https://dongkwang-precision-india.vercel.app)**

### 📱 **Mobile App Experience**
- **PWA Ready**: Add to home screen for native app experience
- **Mobile Optimized**: Touch-friendly interface with hamburger menu
- **Responsive Design**: Works perfectly on all screen sizes
- **Dark/Light Theme**: System theme support

### 🔐 **Test Credentials**
- **Email**: `admin@erp.com` | **Password**: `admin123`
- **Employee ID**: `BF-PSRF` | **Password**: `admin123`

---

## 📋 **Features**

### 🎯 **Core ERP Modules**
- **📊 Dashboard** - Real-time metrics and KPIs
- **📈 Analytics** - Business intelligence and reporting
- **📦 Inventory** - Raw materials and finished goods tracking
- **⚙️ Production** - Manufacturing workflow management
- **💰 Financial Management** - Complete accounting system
- **💬 Chat System** - Team communication and file sharing
- **👥 Employee Management** - HR and workforce management
- **📋 Reports** - Comprehensive business reports
- **✅ Quality Control** - Inspection and compliance tracking
- **🏭 Machine Management** - Equipment monitoring and maintenance
- **⏰ Attendance** - Time tracking and payroll integration
- **📤📥 Import/Export** - Data management utilities
- **🤖 Automation** - Workflow automation
- **🔔 Notifications** - Real-time alerts and updates

### 🎨 **User Experience**
- **🌓 Dark/Light Theme** - Professional theming system
- **📱 Mobile First** - Responsive design for all devices
- **⚡ Lightning Fast** - Optimized performance
- **🎯 Role-Based Access** - Admin, Supervisor, Operator roles
- **🔐 Secure Authentication** - Login system with session management
- **📊 Real-Time Updates** - Live data synchronization

### 🛠️ **Technical Features**
- **🚀 Modern Stack** - Next.js 14, TypeScript, Tailwind CSS
- **📱 PWA Support** - Progressive Web App capabilities
- **🔧 Type Safety** - Full TypeScript implementation
- **🎨 Professional UI** - Industrial design aesthetic
- **📊 Mock Data** - Realistic demo data included
- **🔌 Easy Deployment** - Vercel hosting ready

---

## 🏗️ **Tech Stack**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.35 | React Framework |
| **TypeScript** | 5.0 | Type Safety |
| **Tailwind CSS** | 3.4 | Styling |
| **Lucide React** | Latest | Icons |
| **React Hooks** | Latest | State Management |
| **PWA** | - | Mobile App Experience |

---

## 🚀 **Quick Start**

### 📋 **Prerequisites**
- **Node.js** 16+ and npm
- **Git** for version control
- **Modern browser** (Chrome, Firefox, Safari, Edge)

### 🔧 **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd new_erp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🔐 **Login Credentials**
- **Admin**: `admin@erp.com` / `admin123`
- **Employee**: `BF-PSRF` / `admin123`

---

## 📁 **Project Structure**

```
new_erp/
├── 📂 app/                    # Next.js App Router
│   ├── 📂 (main)/             # Protected routes
│   │   ├── 📊 dashboard/       # Dashboard overview
│   │   ├── 📈 analytics/        # Business analytics
│   │   ├── 📦 inventory/        # Inventory management
│   │   ├── ⚙️ production/       # Manufacturing
│   │   ├── 💰 financial-management/ # Accounting system
│   │   ├── 💬 chat/            # Team communication
│   │   ├── 👥 employees/        # HR management
│   │   ├── 📋 reports/          # Business reports
│   │   ├── ✅ quality-control/   # Quality assurance
│   │   ├── 🏭 machines/         # Equipment tracking
│   │   ├── ⏰ attendance/        # Time tracking
│   │   ├── 📤 export/           # Data export
│   │   ├── 📥 import/           # Data import
│   │   ├── 🤖 automation/       # Workflow automation
│   │   └── 🔔 notifications/     # Alert system
│   ├── 📂 auth/               # Authentication pages
│   └── 📄 page.tsx            # Home page
├── 📂 components/              # Reusable components
│   ├── 📂 layout/              # Layout components
│   ├── 📂 ui/                  # UI components
│   └── 📂 providers/           # Context providers
├── 📂 lib/                    # Utility functions
├── 📂 types/                  # TypeScript definitions
├── 📂 public/                 # Static assets
└── 📂 docs/                   # Documentation
```

---

## 🔧 **Development**

### 📝 **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### 🎨 **Environment Variables**

Create a `.env.local` file:

```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 🔐 **Authentication System**

- **Role-Based Access Control** (RBAC)
- **Session Management** with secure tokens
- **Multiple Login Methods** (Email, Employee ID)
- **Password Protection** with encrypted storage

---

## 📱 **Mobile App Features**

### 📲 **PWA (Progressive Web App)**
- **Installable**: Add to home screen
- **Offline Support**: Basic functionality offline
- **App Shortcuts**: Quick access to main modules
- **Native Feel**: Full-screen experience

### 📱 **Mobile Optimizations**
- **Touch-Friendly**: Large buttons and gestures
- **Hamburger Menu**: Compact navigation
- **Responsive Grid**: Adaptive layouts
- **Fast Loading**: Optimized for mobile networks

---

## 🚀 **Deployment**

### 🌐 **Production Deployment**

The application is already deployed and live:

**🔗 [https://dongkwang-precision-india.vercel.app](https://dongkwang-precision-india.vercel.app)**

### 📱 **Mobile App Installation**

1. **Visit** the live URL on mobile
2. **Add to Home Screen**: 
   - Chrome: Menu → "Add to Home screen"
   - Safari: Share → "Add to Home Screen"
3. **Launch** like a native app

### 🔄 **Update Process**

```bash
# Build and deploy
npm run build
npx vercel --prod
```

---

## 🎯 **Business Modules**

### 📊 **Dashboard**
- Real-time production metrics
- Financial KPIs and charts
- Quick actions and shortcuts
- Recent activity feed

### 📦 **Inventory Management**
- Raw material tracking
- Finished goods management
- Stock level alerts
- Barcode scanning support

### ⚙️ **Production Management**
- Work order management
- Bill of materials (BOM)
- Production scheduling
- Quality control integration

### 💰 **Financial Management**
- General ledger and chart of accounts
- Accounts payable/receivable
- Budget management and variance analysis
- Expense tracking and approvals

### 💬 **Chat System**
- Real-time messaging
- File attachment support
- Threaded conversations
- Team collaboration

---

## 🔧 **Configuration**

### 🎨 **Theme Customization**
- **Dark Mode**: Easy on the eyes
- **Light Mode**: Clean and professional
- **System Detection**: Auto-detects user preference
- **Persistent Settings**: Remembers user choice

### 👥 **User Roles**
- **SUPERUSER**: Full system access
- **ADMIN**: Management access
- **SUPERVISOR**: Department access
- **OPERATOR**: Basic operational access

---

## 📈 **Analytics & Reporting**

### 📊 **Business Intelligence**
- Production efficiency metrics
- Financial performance reports
- Inventory turnover analysis
- Employee productivity tracking

### 📋 **Custom Reports**
- Export to PDF/Excel
- Scheduled report generation
- Real-time dashboards
- Historical data analysis

---

## 🔒 **Security**

### 🛡️ **Security Features**
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Principle of least privilege
- **Session Management**: Secure session handling
- **Input Validation**: XSS and SQL injection prevention

### 🔐 **Data Protection**
- **Encrypted Storage**: Sensitive data protection
- **Secure APIs**: Protected routes and endpoints
- **Audit Trail**: Activity logging
- **Compliance**: Industry standard adherence

---

## 🌍 **Integration Ready**

### 🗄️ **Database Integration**
The system is structured to easily integrate with:

- **PostgreSQL** - Primary database option
- **MySQL** - Popular open-source database
- **MongoDB** - NoSQL database option
- **Supabase** - Backend-as-a-service

### 🔌 **Third-Party Services**
- **Payment Gateways** - Stripe, Razorpay integration
- **Email Services** - SendGrid, AWS SES
- **Cloud Storage** - AWS S3, Google Cloud
- **API Integration** - RESTful API endpoints

---

## 📞 **Support & Documentation**

### 📚 **Documentation**
- **API Documentation**: Complete API reference
- **User Guides**: Step-by-step instructions
- **Developer Docs**: Integration guidelines
- **Video Tutorials**: Feature walkthroughs

### 🆘 **Support Channels**
- **Email Support**: support@dongkwang.com
- **Issue Tracking**: GitHub issues
- **Community Forum**: User discussions
- **Knowledge Base**: FAQ and troubleshooting

---

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### 👥 **Development Team**
- **Frontend Developers**: React/Next.js specialists
- **Backend Developers**: Node.js/TypeScript experts
- **UI/UX Designers**: Modern interface designers
- **DevOps Engineers**: Deployment and CI/CD

---

## 🎉 **Acknowledgments**

Built with ❤️ for **Dongkwang Precision India Pvt Ltd**

**A modern, comprehensive ERP solution that empowers manufacturing excellence through technology.**

---

## 📞 **Contact**

- **Company**: Dongkwang Precision India Pvt Ltd
- **Email**: info@dongkwangprecision.com
- **Website**: [https://dongkwang-precision-india.vercel.app](https://dongkwang-precision-india.vercel.app)
- **Support**: support@dongkwang.com

---

*"Transforming Manufacturing Operations Through Digital Innovation"* 🏭
# erp_sytem
