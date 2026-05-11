# Recall5 AI — Firebase Edition

## Setup (5 steps)

### 1. Install dependencies
```bash
npm install
```

### 2. Enable Firebase services
In your Firebase console (child-behaviour project):
- **Authentication** → Sign-in methods → Enable **Google** and **Email/Password**
- **Firestore Database** → Create database (start in test mode)
- **Storage** → Get started (start in test mode)

### 3. Firestore Security Rules (paste in Firebase console)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /revisions/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
    match /streaks/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /weak_topics/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

### 4. Firebase Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{uid}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### 5. Run
```bash
npm run dev
```

## Build for production
```bash
npm run build
```
Deploy the `dist/` folder to Firebase Hosting, Vercel, or Netlify.

## What changed from original
- ✅ Supabase → Firebase (Auth, Firestore, Storage)
- ✅ Supabase Edge Function → Gemini 1.5 Flash API (direct from client)
- ✅ Session-based → Real user accounts (Google + Email/Password)
- ✅ TanStack Start (SSR) → Pure Vite React SPA
