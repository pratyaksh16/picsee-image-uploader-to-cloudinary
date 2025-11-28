## Picsee – Image Uploader to Cloudinary 📸☁️

- **What it is**: A small, production-ready image uploader with drag-and-drop, previews, and smooth upload progress.
- **What it delivers**: Multi-file uploads to Cloudinary with per-file status, retries, and a clean desktop/mobile-friendly UI.

## Tech Stack ⚙️

- **Core**: React ⚛️, TypeScript 🧩, Vite ⚡.
- **State**: Lightweight `zustand` 🐻 store for file manager state.
- **UI**: Material UI 🎨 for fast, consistent component styling.
- **Animations**: `auto-animate` ✨ for smooth `UploadProgressCard` transitions.

## Features at a Glance 🚀

- **Uploads**: Drag & drop, click-to-upload, multi-file selection, image-only validation (jpg, jpeg, png, gif, webp), 5MB max per file.
- **File Management**: Thumbnails, file size, per-file progress and status (pending/uploading/success/error), remove and retry support.
- **UX States**: Empty, hover, drag-active, loading, success, and error states with clear feedback.
- **Responsiveness**: Layout tuned for both desktop and mobile usage 📱💻.

## Prerequisites 🧰

- **Node**: v24+ recommended.
- **Package Manager**: npm v11+ (or compatible).

## Setup & Environment 🔧

- **Install deps**:
  - `npm install`
- **Create `.env` in project root** with:
  - `VITE_CLOUDINARY_API_URL`
  - `VITE_CLOUDINARY_CLOUD_NAME`
  - `VITE_CLOUDINARY_UPLOAD_PRESET`
  - `VITE_CLOUDINARY_API_KEY`
  - `VITE_CLOUDINARY_API_SECRET`

## Running Locally 💻

- **Dev server**: `npm run dev` then open the shown `localhost` URL.
- **Production build**: `npm run build` and optionally `npm run preview` to test the built app.

## Demo Video 🎥

- **Overview**: Short walkthrough covering drag-drop, mobile flow, validations, retries, and Cloudinary uploads.
- **Link**: [`Demo.mp4`](Demo.mp4) in the project root shows drag-drop uploads, progress cards, validations, retries, and Cloudinary integration end-to-end.

## Support the Project ❤️

- **Star it**: If you like this, drop a ⭐ on the GitHub repo to help it reach more devs.
- **Share it**: Feel free to share the repo or demo video with friends, teams, or on socials.
