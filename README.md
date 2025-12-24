# AGTALIST - Modern Content Platform

A production-ready, cloud-based content platform for YouTubers. Built with Next.js, MongoDB, and Tailwind CSS.

## ✨ Features

- 🎥 **Video Management** - YouTube embeds, direct video hosting
- 📸 **Photo Gallery** - Masonry layout with optimized loading
- 💾 **Programs/Files** - Downloadable resources with metadata
- 🔗 **External Links** - Curated link management
- 🔐 **Admin Dashboard** - Protected content management
- 💰 **Monetization Ready** - Monetag integration support
- 📱 **Mobile-First** - Responsive design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Vercel account (for deployment)

### Local Development

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd agtalist
   npm install
   ```

2. **Configure Environment**
   
   Create `.env.local` with your MongoDB credentials:
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/agtalist
   JWT_SECRET=your-secret-key-here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 📦 Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Framework: Next.js (auto-detected)

3. **Set Environment Variables**
   
   In Vercel Project Settings → Environment Variables, add:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel domain)

4. **Deploy**
   
   Vercel will automatically build and deploy!

## 🎨 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Animations**: Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas (Mongoose)
- **Auth**: JWT with HTTP-only cookies
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📂 Project Structure

```
agtalist/
├── src/
│   ├── app/              # App Router pages
│   │   ├── admin/        # Protected admin dashboard
│   │   ├── api/          # API routes (auth, content)
│   │   ├── videos/       # Public video pages
│   │   ├── photos/       # Photo gallery
│   │   └── programs/     # Downloads page
│   ├── components/       # Reusable UI components
│   ├── lib/              # Database & auth utilities
│   └── models/           # Mongoose schemas
└── public/               # Static assets
```

## 🔒 Admin Access

- Navigate to `/admin/login`
- Use credentials from your environment variables
- Upload content via URL or direct file links

## 🎯 Key Pages

- `/` - Home (video stripe, masonry gallery, programs)
- `/videos` - All videos grid
- `/photos` - Photo gallery
- `/programs` - Downloadable files
- `/admin` - Dashboard (protected)

## 💡 Customization

### Monetag Integration
Edit `src/components/MonetagScript.tsx` with your zone ID.

### Social Links
Update URLs in `src/components/Header.tsx`:
- YouTube: https://www.youtube.com/@3ackrab
- Pinterest: https://pin.it/4KSyyBtF8

### Color Scheme
Primary color is red. Customize in Tailwind config or component classes.

## 📝 License

MIT

---

Built with ❤️ for creators
