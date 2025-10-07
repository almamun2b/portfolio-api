# Portfolio API

A comprehensive **Portfolio & Blog API** built with **TypeScript, Express.js, Prisma ORM, and PostgreSQL**. This RESTful API serves as the backend for a personal portfolio website, providing endpoints for managing blogs, projects, categories, users, and authentication.

### Live Frontent: https://portfolio-mamun.vercel.app/

### Live Backend: https://portfolio-mamun-api.vercel.app/

---

## 🚀 Features

### Core Features

- **Blog Management**: Create, read, update, delete blog posts with categories and tags
- **Project Showcase**: Manage portfolio projects with different types (Frontend, Backend, Fullstack)
- **User Management**: User registration, authentication, and role-based access control
- **Category System**: Organize blogs with categories and slug-based routing
- **Authentication**: Secure login system with credential-based and Google OAuth support
- **Search & Filtering**: Advanced search and filtering capabilities for blogs and projects
- **Featured Content**: Mark blogs as featured for homepage display
- **View Tracking**: Track blog post views and analytics
- **Super Admin Seeding**: Automatic super admin account creation

### Technical Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast and minimalist web framework
- **Prisma ORM**: Type-safe database access with PostgreSQL
- **Modular Architecture**: Clean, scalable project structure
- **Environment Configuration**: Secure environment variable management
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Compression**: Response compression for better performance
- **Graceful Shutdown**: Proper server shutdown handling
- **Database Migrations**: Version-controlled database schema changes
- **Vercel Deployment**: Ready for serverless deployment

---

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: bcryptjs for password hashing
- **File Upload**: Cloudinary integration
- **Package Manager**: pnpm
- **Deployment**: Vercel

---

## 📁 Project Structure

```
portfolio-api/
├── prisma/
│   ├── migrations/           # Database migrations
│   └── schema.prisma        # Database schema definition
├── src/
│   ├── app/
│   │   ├── config/          # Configuration files
│   │   │   ├── db.ts        # Database connection
│   │   │   └── env.ts       # Environment variables
│   │   ├── modules/         # Feature modules
│   │   │   ├── auth/        # Authentication module
│   │   │   ├── blog/        # Blog management module
│   │   │   ├── category/    # Category management module
│   │   │   ├── project/     # Project management module
│   │   │   └── user/        # User management module
│   │   ├── routes/          # Route definitions
│   │   │   └── index.ts     # Main router
│   │   └── utils/           # Utility functions
│   │       └── seedSuperAdmin.ts # Super admin seeding
│   ├── app.ts              # Express app configuration
│   └── server.ts           # Server entry point
├── dist/                   # Compiled JavaScript files
├── package.json           # Project dependencies and scripts
├── pnpm-lock.yaml        # Package lock file
├── tsconfig.json         # TypeScript configuration
├── vercel.json           # Vercel deployment configuration
└── README.md             # Project documentation
```

---

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

### User

- **Fields**: id, name, email, password, role, phone, picture, status, isVerified
- **Roles**: SUPER_ADMIN, ADMIN, USER
- **Status**: ACTIVE, INACTIVE, BLOCK

### Blog

- **Fields**: id, title, slug, description, content, image, isFeatured, categoryId, tags, views, authorId
- **Relations**: belongs to Category and User (author)
- **Features**: Auto-generated slugs, view tracking, featured posts

### Project

- **Fields**: id, title, slug, description, content, image, type, projectUrl, codeUrl, technologies
- **Types**: Frontend, Backend, Fullstack
- **Features**: Technology stack tracking, project and code URLs

### Category

- **Fields**: id, name, slug
- **Relations**: has many Blogs
- **Features**: Auto-generated slugs for SEO-friendly URLs

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- pnpm package manager

### 1. Clone the Repository

```bash
git clone https://github.com/almamun2b/portfolio-api.git
cd portfolio-api
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"

# Server
NODE_ENV="development"
PORT="5000"

# JWT Configuration
JWT_ACCESS_SECRET="your-jwt-access-secret"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
JWT_REFRESH_EXPIRATION="7d"

# Password Hashing
BCRYPT_SALT_ROUNDS="12"

# Super Admin Account
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_PASSWORD="your-super-admin-password"

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma:migrate

# (Optional) Open Prisma Studio to view data
pnpm prisma:studio
```

### 5. Start Development Server

```bash
pnpm dev
```

The API will be available at `http://localhost:5000`

---

## 📜 Available Scripts

```bash
# Development
pnpm dev                    # Start development server with hot reload

# Production
pnpm build                  # Build TypeScript to JavaScript
pnpm start                  # Start production server

# Database
pnpm prisma:push           # Push schema changes to database
pnpm prisma:pull           # Pull schema from database
pnpm prisma:studio         # Open Prisma Studio
pnpm prisma:seed           # Seed database with initial data
pnpm prisma:reset          # Reset database and run migrations
pnpm prisma:migrate        # Run database migrations

# Utilities
pnpm postinstall           # Generate Prisma client (runs after install)
```

---

## 🔗 API Endpoints

### Base URL

- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://your-domain.com/api/v1`

### Authentication Endpoints

```
POST   /auth/login          # Login with credentials
POST   /auth/google         # Google OAuth authentication
```

### User Management

```
GET    /user                # Get all users
GET    /user/:id            # Get user by ID
POST   /user                # Create new user
PUT    /user/:id            # Update user
DELETE /user/:id            # Delete user
```

### Blog Management

```
GET    /blog                # Get all blogs (with pagination, search, filters)
GET    /blog/:id            # Get blog by ID or slug
POST   /blog                # Create new blog
PUT    /blog/:id            # Update blog
DELETE /blog/:id            # Delete blog
GET    /blog/stats          # Get blog statistics
GET    /blog/popular        # Get popular blogs
GET    /blog/featured       # Get featured blogs
GET    /blog/tags           # Get all unique tags
```

### Project Management

```
GET    /project             # Get all projects (with pagination, search, filters)
GET    /project/:id         # Get project by ID or slug
POST   /project             # Create new project
PUT    /project/:id         # Update project
DELETE /project/:id         # Delete project
```

### Category Management

```
GET    /category            # Get all categories
GET    /category/:id        # Get category by ID or slug
POST   /category            # Create new category
PUT    /category/:id        # Update category
DELETE /category/:id        # Delete category
```

### Query Parameters

#### Blog Endpoints

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search in title, description, content
- `isFeatured`: Filter by featured status (true/false)
- `tags`: Filter by tags (comma-separated)
- `category`: Filter by category ID or slug
- `sortBy`: Sort field (createdAt, updatedAt, title, views)
- `sortOrder`: Sort direction (asc, desc)

#### Project Endpoints

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search in title, description, content, technologies
- `type`: Filter by project type (Frontend, Backend, Fullstack)
- `sortBy`: Sort field (createdAt, updatedAt, title, type)
- `sortOrder`: Sort direction (asc, desc)

---

## 🎯 Project Goals

This Portfolio API is designed to:

1. **Showcase Technical Skills**: Demonstrate proficiency in modern backend technologies
2. **Support Portfolio Website**: Provide robust API for a personal portfolio frontend
3. **Content Management**: Enable easy management of blogs and projects
4. **Scalable Architecture**: Implement clean, maintainable, and scalable code structure
5. **Best Practices**: Follow industry standards for API design and security
6. **Learning Platform**: Serve as a reference for TypeScript, Express.js, and Prisma integration

---

## 🚀 Deployment

### Vercel Deployment

The project is configured for easy deployment on Vercel:

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all required environment variables in Vercel dashboard
3. **Database**: Ensure your PostgreSQL database is accessible from Vercel
4. **Deploy**: Vercel will automatically build and deploy your application

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `DATABASE_URL`
- `NODE_ENV=production`
- `PORT` (optional, Vercel sets this automatically)
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `BCRYPT_SALT_ROUNDS`
- `SUPER_ADMIN_EMAIL`
- `SUPER_ADMIN_PASSWORD`

---

## 🔒 Security Features

- **Password Hashing**: Secure password storage using bcryptjs
- **Environment Variables**: Sensitive data stored in environment variables
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Data validation and sanitization
- **Role-based Access**: Different user roles with appropriate permissions
- **SQL Injection Prevention**: Prisma ORM provides built-in protection

---

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abdullah Al Mamun**

- GitHub: [@almamun2b](https://github.com/almamun2b)
- Email: almamun2b@gmail.com
- Portfolio: [https://portfolio-mamun.vercel.app](https://portfolio-mamun.vercel.app)

---

## 🙏 Acknowledgments

- **Next Level Web Development Bootcamp** for the foundational learning
- **Prisma Team** for the excellent ORM
- **Express.js Community** for the robust framework
- **TypeScript Team** for type safety and developer experience

---

## 📞 Support

If you have any questions or need help with setup, please:

1. Check the existing [Issues](https://github.com/almamun2b/portfolio-api/issues)
2. Create a new issue if your problem isn't already addressed
3. Provide detailed information about your environment and the issue

---

_Built with ❤️ using TypeScript, Express.js, and Prisma_
