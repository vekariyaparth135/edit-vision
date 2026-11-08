# 🎬 Edit Vision — Full-Stack Portfolio & Admin CMS

> **"Where Every Frame Tells a Story"**  
> Premium portfolio website and content management system built for freelance video editor and colorist **Vekariya Raj**.

---

## 🌟 Brand Identity & Highlights

- **Brand Name**: Edit Vision
- **Tagline**: *"Where Every Frame Tells a Story"*
- **Owner**: Vekariya Raj (Cinematic Video Editor & Colorist)
- **Direct Contact**: `+91 9723501437` (Click-to-Call & WhatsApp)
- **Theme & Aesthetics**: Premium luxury minimalism
  - **Gold**: `#C9A24B` (Gradient to `#E8C766`)
  - **Black**: `#0A0A0A`
  - **Dark Surfaces**: `#121212`, `#181818`
  - **Typography**: Cormorant Garamond (Headings) & Montserrat (Body)
  - **Modes**: Smooth Light / Dark mode toggle

---

## ⚡ Tech Stack

### Frontend (`client/`)
- **React 18** with **Vite**
- **Tailwind CSS** with custom gold gradients, glowing shadows & dark mode
- **Framer Motion** for smooth scroll animations and modal transitions
- **Lucide React** for modern sleek icons
- **Axios** with request/response interceptors & credentials support
- **React Router DOM v6** with protected route guards

### Backend (`server/`)
- **Node.js** & **Express.js** (ES Modules)
- **MongoDB** & **Mongoose** for data modeling
- **JWT (JSON Web Tokens)** stored in httpOnly cookies & Bearer headers
- **Bcrypt.js** for one-way password hashing
- **Multer & Cloudinary** (with automatic local disk storage fallback if Cloudinary keys aren't configured yet)
- **Helmet, Morgan & CORS** for enterprise security and logging

---

## 📁 Project Structure

```text
edit_vision/
├── Logo.png                         # Original Brand Logo
├── package.json                     # Root orchestrator
├── .gitignore
├── README.md                        # Documentation & deployment guide
│
├── server/                          # Backend API (Node + Express + MongoDB)
│   ├── package.json
│   ├── .env.example                 # Environment template
│   ├── .env                         # Local environment variables
│   ├── server.js                    # Express application entry
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── cloudinary.js            # Cloudinary & Multer configuration
│   ├── models/
│   │   ├── User.js                  # Admin authentication model
│   │   ├── Media.js                 # Portfolio videos & photos
│   │   ├── Service.js               # Editing packages & pricing
│   │   ├── Testimonial.js           # Client reviews & star ratings
│   │   ├── Message.js               # Contact form inquiries
│   │   ├── Settings.js              # Site-wide settings, hero, bio & social links
│   │   └── Visit.js                 # Page impression analytics
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification middleware
│   │   ├── upload.js                # Multipart form upload handler
│   │   └── errorHandler.js          # Centralized error handling
│   ├── controllers/
│   │   ├── authController.js        # Admin login, session check & password change
│   │   ├── mediaController.js       # Media CRUD, ordering, publish toggle
│   │   ├── serviceController.js     # Services CRUD
│   │   ├── testimonialController.js # Testimonials CRUD
│   │   ├── messageController.js     # Contact inquiries & WhatsApp response
│   │   ├── settingsController.js    # Hero & website configurations
│   │   └── statsController.js       # Dashboard analytics & charts data
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── mediaRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── testimonialRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── settingsRoutes.js
│   │   └── statsRoutes.js
│   ├── seeds/
│   │   └── seed.js                  # Database seeder (Admin + sample data)
│   └── uploads/                     # Local file storage fallback
│
└── client/                          # Frontend Application (React + Vite + Tailwind)
    ├── package.json
    ├── vite.config.js               # Vite config with API proxy
    ├── tailwind.config.js           # Gold & Dark theme configuration
    ├── postcss.config.js
    ├── index.html                   # HTML template with Google Fonts & SEO
    ├── public/
    │   ├── Logo.png                 # Brand logo in navbar, footer & favicon
    │   ├── robots.txt
    │   └── sitemap.xml
    └── src/
        ├── index.css                # Tailwind directives & gold utilities
        ├── main.jsx                 # Entry point with Context Providers
        ├── App.jsx                  # Main routing configuration
        ├── context/
        │   ├── AuthContext.jsx      # Admin login & session state
        │   ├── ThemeContext.jsx     # Light / Dark mode switcher
        │   └── SettingsContext.jsx  # Dynamic website configuration state
        ├── services/
        │   └── api.js               # Axios API endpoints
        ├── components/
        │   ├── Navbar.jsx           # Sticky navbar with logo, nav links & CTA
        │   ├── Footer.jsx           # Luxury footer with links & admin gateway
        │   ├── FloatingWhatsApp.jsx # Floating WhatsApp & Click-to-Call buttons
        │   ├── BeforeAfterSlider.jsx# Interactive Raw vs Graded footage slider
        │   ├── VideoModal.jsx       # Universal MP4 / YouTube / Drive player
        │   ├── LightboxModal.jsx    # Photo lightbox modal
        │   ├── ProtectedRoute.jsx   # Route guard for /admin
        │   ├── ThemeToggle.jsx      # Sun / Moon toggle
        │   └── LoadingSpinner.jsx   # Gold spinner component
        └── pages/
            ├── Home.jsx             # Public single-page portfolio
            ├── NotFound.jsx         # Custom 404 page
            └── admin/
                ├── AdminLayout.jsx         # Sidebar layout for CMS
                ├── AdminLogin.jsx          # Login screen with logo & hints
                ├── AdminDashboard.jsx      # Analytics overview & charts
                ├── MediaManager.jsx        # Full media CRUD & drag reordering
                ├── ServicesManager.jsx     # Service package & pricing CRUD
                ├── TestimonialsManager.jsx # Client review manager
                ├── MessagesManager.jsx     # Inquiries inbox & WhatsApp reply
                ├── SettingsManager.jsx     # Showreel, hero, bio & SEO editor
                └── PasswordChange.jsx      # Change admin password
```

---

## 📡 REST API Route List

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **POST** | `/api/auth/login` | Public | Admin login, generates JWT cookie & token |
| **GET** | `/api/auth/me` | Admin | Get current authenticated admin profile |
| **PUT** | `/api/auth/updatepassword` | Admin | Update admin password |
| **POST** | `/api/auth/logout` | Admin | Clear authentication session |
| **GET** | `/api/media` | Public | Get published portfolio media (filtered by category) |
| **GET** | `/api/media/:id` | Public | Get single media item and increment view count |
| **GET** | `/api/media/admin/all` | Admin | Get all media including drafts |
| **POST** | `/api/media` | Admin | Upload new video/photo or add YouTube link |
| **PUT** | `/api/media/:id` | Admin | Update media metadata / replace file |
| **PUT** | `/api/media/reorder` | Admin | Batch update display order |
| **PATCH** | `/api/media/:id/toggle-publish`| Admin | Publish or unpublish media item |
| **DELETE**| `/api/media/:id` | Admin | Delete media item |
| **GET** | `/api/services` | Public | Get active services and pricing |
| **GET** | `/api/services/admin/all` | Admin | Get all service packages |
| **POST** | `/api/services` | Admin | Create new service package |
| **PUT** | `/api/services/:id` | Admin | Update service package |
| **DELETE**| `/api/services/:id` | Admin | Delete service package |
| **GET** | `/api/testimonials` | Public | Get published testimonials |
| **GET** | `/api/testimonials/admin/all` | Admin | Get all testimonials |
| **POST** | `/api/testimonials` | Admin | Add new testimonial |
| **PUT** | `/api/testimonials/:id` | Admin | Update testimonial |
| **DELETE**| `/api/testimonials/:id` | Admin | Delete testimonial |
| **POST** | `/api/messages` | Public | Submit contact form inquiry |
| **GET** | `/api/messages` | Admin | Get inquiries inbox (filter by read/unread) |
| **PUT** | `/api/messages/:id` | Admin | Mark inquiry as read/unread |
| **DELETE**| `/api/messages/:id` | Admin | Delete inquiry |
| **GET** | `/api/settings` | Public | Get site settings, hero info, bio & colors |
| **PUT** | `/api/settings` | Admin | Update site settings, upload logo, bio photo |
| **POST** | `/api/stats/visit` | Public | Log page impression for analytics |
| **GET** | `/api/stats/dashboard` | Admin | Get visitor chart, counters, category breakdown |

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance `mongodb://127.0.0.1:27017` OR free **MongoDB Atlas** connection string)

### 2. Install All Dependencies
From the root directory:
```bash
npm run install:all
```
*(Or navigate to `server` and `client` individually and run `npm install`)*

### 3. Seed Initial Database & Admin User
Ensure your MongoDB connection string in `server/.env` is active, then execute:
```bash
npm run seed
```
This automatically seeds:
- **Default Admin Account**:
  - **Email**: `admin@editvision.com`
  - **Password**: `Admin@123456`
- Default site settings & hero showreel
- 6 Premium video editing service packages
- 8 Curated portfolio items (Weddings, Reels, YouTube, Commercial Ads, Photos)
- 4 Verified client reviews
- Sample client inquiries for testing the inbox

### 4. Start Development Servers
Run both frontend and backend concurrently from the root:
```bash
npm run dev
```
- **Public Portfolio Site**: [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard (Vekariya Raj)**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Client Portal (Clients & Visitors)**: [http://localhost:5173/login](http://localhost:5173/login)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Role-Based Access Control (RBAC) Architecture

| Role | Permitted Access | Restricted Areas |
| :--- | :--- | :--- |
| **Admin (`Vekariya Raj`)** | Full CMS: Media Manager, Hero Showreel, Services, Testimonials, Inquiries Inbox, Site Settings, System Logs | None |
| **Client (`Clients / Visitors`)** | Dedicated **Client Portal** (`/client`): Submit project briefs, track inquiry status, direct WhatsApp connect, client password settings | Blocked from `/admin` & all admin endpoints with HTTP 403 Forbidden |

### Protected API Middleware
- `protect`: Verifies JWT from cookie or Bearer token header.
- `adminOnly`: Strictly verifies `req.user.role === 'admin'`. Any client attempting to modify settings, media, or view messages is immediately rejected.

---

## ☁️ Step-by-Step Production Deployment Guide

### Phase A: Setup MongoDB Atlas (Database)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a user (e.g. `editvision_user`) with a strong password.
4. Under **Network Access**, click **Add IP Address** & choose **Allow Access From Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** &rarr; **Drivers** & copy your MongoDB connection URI:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/edit_vision?retryWrites=true&w=majority
   ```

### Phase B: Deploy Backend (Render.com)
1. Create a free account on [Render.com](https://render.com).
2. Click **New +** &rarr; **Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: *Your MongoDB Atlas connection URI*
   - `JWT_SECRET`: *A secure random string*
   - `CLIENT_URL`: *Your frontend Vercel URL (e.g. `https://edit-vision.vercel.app`)*
   - `CLOUDINARY_CLOUD_NAME`: *(Optional)*
   - `CLOUDINARY_API_KEY`: *(Optional)*
   - `CLOUDINARY_API_SECRET`: *(Optional)*
6. Click **Deploy Web Service**. Once live, copy your backend URL (e.g. `https://edit-vision-api.onrender.com`).

### Phase C: Deploy Frontend (Vercel)
1. Sign up on [Vercel](https://vercel.com).
2. Click **Add New...** &rarr; **Project** and select your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://edit-vision-api.onrender.com/api` *(Your Render backend URL + `/api`)*
5. Click **Deploy**. Your custom video editing portfolio is now live worldwide!

---

## 📱 Contact & Support

Created for **Vekariya Raj** (Edit Vision).  
Direct Inquiries: **+91 9723501437**

