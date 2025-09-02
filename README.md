# School Management System

A modern, full-stack web application for managing school records, built with **Next.js**, **Prisma**, **Cloudinary**, and **MySQL**. The app provides a user-friendly interface to create, read, update, and delete (CRUD) school details, including image uploads, with robust search functionality and a responsive design. Deployed on **Vercel** with continuous integration via GitHub, it demonstrates production-ready development practices.

## Live Demo

- **Deployed URL**: [https://vercel.com/dnyaneshwars-projects-936dcd1a/school-management](https://vercel.com/dnyaneshwars-projects-936dcd1a/school-management)
- **GitHub Repository**: [https://github.com/sdnyaneshwar/school-management](https://github.com/sdnyaneshwar/school-management)

## Features

- **CRUD Operations**:
  - **Create**: Add schools with details (name, address, city, state, contact, email) and an image (JPEG/PNG).
  - **Read**: View schools in a responsive grid with search by name, city, or state.
  - **Update**: Edit school details and replace images.
  - **Delete**: Remove schools and their images from the database and Cloudinary.
- **Search**: Filter schools dynamically by name, city, or state.
- **Image Management**: Upload and manage images via Cloudinary for scalability and optimization.
- **Responsive UI**: Mobile-friendly design with Tailwind CSS and a consistent navigation bar.
- **Error Handling**: Validates form inputs, handles invalid IDs, and provides user-friendly feedback.
- **Loading States**: Displays loading indicators during form submissions and data fetching.
- **Production-Ready**: Deployed on Vercel with Aiven MySQL for data storage and CI/CD via GitHub.

## Technologies Used

- **Frontend**: Next.js (React), Tailwind CSS, `next-cloudinary`, `react-hook-form`, `zod`
- **Backend**: Next.js API Routes, Prisma ORM, MySQL (Aiven)
- **Image Storage**: Cloudinary for optimized image uploads and delivery
- **Deployment**: Vercel with GitHub integration for automatic deployments
- **Other**: Formidable (form parsing), Node.js

## Project Structure

```
school-management/
├── prisma/
│   └── schema.prisma        # Prisma schema for MySQL
├── src/
│   ├── app/
│   │   ├── addSchool/       # Add school form
│   │   ├── editSchool/[id]/ # Edit school form
│   │   ├── showSchools/     # List and search schools
│   │   ├── api/schools/     # API routes for CRUD
│   │   ├── page.js          # Home page
│   │   └── layout.js        # Root layout with navbar
│   └── components/
│       └── Navbar.js        # Responsive navigation bar
├── .env.local              # Environment variables (not committed)
├── .gitignore              # Git ignore file
├── next.config.js          # Next.js configuration for Cloudinary
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

## Setup Instructions

### Prerequisites
- **Node.js**: Version 18.x or higher
- **MySQL Database**: A MySQL instance (e.g., Aiven MySQL)
- **Cloudinary Account**: For image uploads
- **Vercel Account**: For deployment
- **Git**: For version control

### Local Development
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sdnyaneshwar/school-management.git
   cd school-management
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env.local` file in the root:
     ```env
     DATABASE_URL=""
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     NEXT_PUBLIC_CLOUDINARY_PRESET_NAME=school_upload
     ```
   - Replace `your_cloud_name`, `your_api_key`, `your_api_secret`, and `school_upload` with your Cloudinary credentials.

4. **Apply Database Schema**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) to view the app.

6. **Test Features**:
   - Add a school at `/addSchool` and verify image upload in Cloudinary.
   - View and search schools at `/showSchools`.
   - Edit or delete schools via `/editSchool/[id]`.
   - Check database updates with `npx prisma studio`.

### Deployment on Vercel
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update project for deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com) → **New Project** → **Import Git Repository**.
   - Select `sdnyaneshwar/school-management` and import.

3. **Set Environment Variables**:
   - In Vercel → **Settings** → **Environment Variables**, add:
     ```
     DATABASE_URL=mysql://avnadmin:njnjknhbgfvyvh@mysql-3ba8d4ab-sdny-064e.d.aivencloud.com:27195/defaultdb?ssl-mode=REQUIRED
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     NEXT_PUBLIC_CLOUDINARY_PRESET_NAME=school_upload
     ```

4. **Deploy**:
   - Click **Deploy** in Vercel.
   - Apply Prisma migrations to Aiven MySQL:
     ```bash
     npx prisma migrate deploy
     ```

5. **Verify**:
   - Access the deployed URL (e.g., `https://school-management.vercel.app`).
   - Test all CRUD operations, search, and image uploads.

## Troubleshooting
- **Build Errors**:
  - Ensure `package.json` includes `"build": "prisma generate && next build"`.
  - Check Vercel logs for specific errors.
- **Database Issues**:
  - Verify `DATABASE_URL` in Vercel and test connectivity with `npx prisma db pull`.
  - Ensure Aiven MySQL service is active.
- **Cloudinary Errors**:
  - Confirm Cloudinary credentials and unsigned `school_upload` preset.
  - Test image uploads in Cloudinary’s dashboard.
- **Runtime Errors**:
  - Check browser console (F12 → Console) and Vercel logs for issues.

## Why This Project Shines
- **Full-Stack Expertise**: Combines Next.js, Prisma, MySQL, and Cloudinary for a robust application.
- **Scalability**: Cloud-based image storage and database ensure production-readiness.
- **Modern UI**: Responsive design with Tailwind CSS and smooth user experience.
- **DevOps**: Vercel deployment with GitHub CI/CD demonstrates modern workflows.
- **Comprehensive Features**: Exceeds requirements with search, error handling, and loading states.

## Contributing
For issues or feature requests, please open an issue or pull request on [GitHub](https://github.com/sdnyaneshwar/school-management).
