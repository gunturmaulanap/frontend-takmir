# 🕌 Multi Masjid - Frontend Management System

Aplikasi frontend untuk sistem manajemen masjid modern yang dibangun dengan Next.js 15, React 19, dan TypeScript. Aplikasi ini menyediakan dashboard komprehensif untuk mengelola berbagai aspek operasional masjid.

## ✨ Fitur Utama

### 🎛️ Dashboard Management
- **Overview Dashboard** - Statistik lengkap dan informasi penting masjid
- **Role-based Access Control** - Sistem peran dengan Spatie Laravel permissions
- **Responsive Design** - Optimal di desktop, tablet, dan mobile

### 👥 Manajemen Pengguna
- **Takmir Management** - Kelola data dan informasi pengurus masjid
- **Staff Management** - Kelola Imam, Muadzin, dan Khatib
- **Jamaah Management** - Database jamaah masjid
- **Staff Schedule** - Penjadwalan dan penugasan staff

### 📅 Event & Kegiatan
- **Event Management** - Buat dan kelola acara masjid
- **Event Categories** - Kategorisasi jenis kegiatan
- **Event Calendar** - Kalender terintegrasi untuk visualisasi acara

### 💰 Keuangan
- **Financial Management** - Pencatatan dan laporan keuangan masjid
- **Transaction Records** - Track pemasukan dan pengeluaran
- **Financial Reports** - Laporan keuangan terperinci

## 🛠️ Tech Stack

### Frontend Framework
- **[Next.js 15](https://nextjs.org/)** - React framework dengan App Router
- **[React 19](https://react.dev/)** - UI library terbaru
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety dan developer experience

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Primitive components untuk aksesibilitas
- **[Lucide React](https://lucide.dev/)** - Icon library modern
- **[React Icons](https://react-icons.github.io/react-icons/)** - Additional icon sets

### State Management & Data Fetching
- **[TanStack Query](https://tanstack.com/query/latest)** - Server state management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Client state management
- **[Axios](https://axios-http.com/)** - HTTP client dengan interceptors

### Form Handling & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Turbopack](https://turbo.build/)** - Next.js bundler yang lebih cepat

## 📋 Prerequisites

Sebelum memulai, pastikan sudah memiliki:

- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm atau yarn** - Package manager
- **Git** - Version control

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url> frontend-takmir
cd frontend-takmir
```

### 2. Install Dependencies
```bash
# Menggunakan npm (recommended)
npm install

# Atau menggunakan yarn
yarn install

# Atau menggunakan pnpm
pnpm install
```

### 3. Environment Variables
Buat file `.env.local` di root project:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication (jika diperlukan)
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-here

# Additional environment variables
NEXT_PUBLIC_APP_NAME="Multi Masjid Management"
```

### 4. Run Development Server
```bash
# Start development server dengan Turbopack
npm run dev

# Atau build mode
npm run build
npm start
```

### 5. Open Application
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard routes group
│   │   ├── dashboard/           # Main dashboard
│   │   ├── takmirs/            # Takmir management
│   │   ├── staffs/             # Staff management (Imam, Muadzin, Khatib)
│   │   ├── jamaahs/            # Jamaah management
│   │   ├── events/             # Event management
│   │   ├── categories/         # Event categories
│   │   ├── finances/           # Financial management
│   │   ├── staff-schedule/     # Staff scheduling
│   │   └── calenders/          # Calendar view
│   ├── auth/                   # Authentication pages
│   ├── home/                   # Landing page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── components/                  # Reusable UI components
│   ├── ui/                    # Base UI components (buttons, inputs, etc.)
│   ├── auth/                  # Authentication components
│   ├── layout/                # Layout components
│   └── shared/                # Shared components
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts             # Authentication hooks
│   ├── useEvents.ts           # Event data hooks
│   ├── useCategories.ts       # Category management hooks
│   └── ...                    # Other custom hooks
├── lib/                        # Utility libraries
│   ├── axios.ts               # HTTP client configuration
│   ├── permissions.ts         # Permission utilities
│   └── utils.ts               # General utilities
├── types/                      # TypeScript type definitions
│   ├── auth.ts                # Auth-related types
│   ├── event.ts               # Event types
│   ├── category.ts            # Category types
│   └── ...                    # Other type definitions
└── utils/                      # Helper functions
    ├── errorHandler.ts        # Error handling utilities
    └── ...                    # Other utilities
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Dependencies
npm install          # Install dependencies
npm update           # Update dependencies
```

## 🌐 API Integration

Aplikasi ini terintegrasi dengan backend API yang memiliki endpoint-endpoint:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Dashboard & Management
- `GET /api/admin/*` - Admin-protected endpoints
- `GET /api/public/*` - Public endpoints
- Dengan role-based access control

## 🎨 Design System

Aplikasi menggunakan design system yang konsisten:

- **Color Palette** - Hijau emerald sebagai primary color
- **Typography** - Geist font family
- **Components** - Berdasarkan Radix UI primitives
- **Responsive** - Mobile-first approach

## 🔐 Authentication & Permissions

- **JWT Authentication** - Token-based authentication
- **Role-based Access** - Superadmin, admin, staff roles
- **Permission Guards** - Component-level protection
- **Route Protection** - Page-level access control

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

### Deployment Options
- **Vercel** (Recommended) - [Deploy to Vercel](https://vercel.com)
- **Netlify** - [Deploy to Netlify](https://netlify.com)
- **Docker** - Container deployment
- **Traditional Hosting** - Static file deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Component Development
- Use TypeScript interfaces for props
- Implement proper error handling
- Add loading states
- Consider accessibility

### API Integration
- Use TanStack Query for data fetching
- Implement proper error handling
- Add loading and error states
- Use optimistic updates where appropriate

## 🐛 Troubleshooting

### Common Issues

**Build Error: TypeScript**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

**Development Server Not Starting**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**API Connection Issues**
- Check environment variables
- Verify API endpoint URLs
- Check CORS configuration

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- Contact the development team
- Check project documentation
- Review issue tracker