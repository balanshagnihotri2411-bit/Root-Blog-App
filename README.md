# Roots: A Dynamic React & Firebase Blogging Platform

Welcome to **Roots**, a modern, responsive blogging web application designed for users to share their thoughts, engage with community feeds, and manage their personal creator profiles. Built using **React (with Vite)** on the frontend and powered by **Firebase** on the backend, Roots offers seamless authentication, real-time database queries, and cloud-based asset storage.

---

## 🚀 Technology Stack

- **Frontend Core:** React 18.x
- **Build Tool / Bundler:** Vite (featuring Fast Refresh & Hot Module Replacement)
- **Routing:** React Router v6 (`react-router-dom`)
- **Backend-as-a-Service:** Firebase 10.x
  - **Authentication:** Email & Password signup, session management
  - **Cloud Firestore:** NoSQL database storing user metadata, profiles, and blog posts
  - **Cloud Storage:** Image upload and hosting for blog cover pictures
- **Styling:** Custom Vanilla CSS for components and layouts
- **State Management:** React hooks integrated with `localStorage` persistence

---

## 📁 Repository Structure & Directory Overview

```text
BlogRootReact/
├── .eslintrc.cjs          # ESLint rules and syntax constraints
├── index.html             # Application HTML template
├── package.json           # Project metadata, scripts, and dependencies
├── vite.config.js         # Vite compilation configuration
├── public/                # Static assets (favicons, public images)
└── src/                   # Main source code
    ├── App.css            # Global styling
    ├── App.jsx            # Application router, protection logic, and layouts
    ├── index.css          # Baseline CSS reset / custom styles
    ├── main.jsx           # React app mount point
    │
    ├── Firebase/
    │   └── Firebase.jsx   # SDK initialization & service exports (Auth, DB, Storage)
    │
    ├── Components/
    │   └── Navbar/        # Shared site navigation component
    │
    ├── hooks/             # Custom Firebase integration hooks
    │   ├── useSignUp.js   # New user registration workflow
    │   ├── useLogin.js    # User verification & session login
    │   ├── useCreatePost.js # Cover image storage & blog document creation
    │   ├── useGetBlog.js  # Global feed fetching and sorting
    │   ├── useUpdateProfile.js # Profile updates synchronization
    │   └── useGetUserById.js # Stub utility hook
    │
    └── pages/             # Distinct application views
        ├── Auth/          # Login & Signup views container
        ├── Home/          # Core feed landing page
        ├── About/         # Creator and platform introduction
        ├── Contact/       # Feedback and info form
        ├── Profile/       # Profile details display
        └── Createpost/    # Authoring interface for new blogs
```

---

## 🛠️ Detailed Architectural Walkthrough

### 1. Routing and Session Protection ([App.jsx](file:///c:/Users/Kakashi/Desktop/CODE/project/BlogRootReact/src/App.jsx))
- Implements navigation logic that reads the `bloguser` key from `localStorage`.
- Automatically checks for an active session inside a `useEffect` hook. If no user is logged in, the app forces a redirect to the `/auth` gateway.
- Defines routing paths for all major views using standard `<Route>` layouts.

### 2. Custom Authentication Hooks
- **[useSignUp.js](file:///c:/Users/Kakashi/Desktop/CODE/project/BlogRootReact/src/hooks/useSignUp.js):** 
  - Performs custom query validations on Firestore to guarantee username uniqueness before registration.
  - Registers the user's credentials with Firebase Auth.
  - Generates a default user profile document under the `users` collection in Firestore with default keys (`followers: []`, `following: []`, `blogs: []`, etc.) mapped to the unique Auth UID.
- **[useLogin.js](file:///c:/Users/Kakashi/Desktop/CODE/project/BlogRootReact/src/hooks/useLogin.js):** 
  - Authenticates users with their email and password.
  - Pulls the user profile document matching the login credentials from Firestore and stores it in `localStorage` as `bloguser`.

### 3. Creating & Retrieving Blogs
- **[useCreatePost.js](file:///c:/Users/Kakashi/Desktop/CODE/project/BlogRootReact/src/hooks/useCreatePost.js):** 
  - Creates a new document within the Firestore `blogs` collection.
  - Generates a local file reader stream to convert the uploaded cover image to a Data URL format.
  - Uploads the image to Firebase Storage at `blogs/{postDocId}` and returns the public download URL.
  - Patches the blog document with the uploaded `imageURL` and updates the author's user document list with the new blog post ID.
- **[useGetBlog.js](file:///c:/Users/Kakashi/Desktop/CODE/project/BlogRootReact/src/hooks/useGetBlog.js):** 
  - Performs an array query on the `blogs` collection and fetches the items.
  - Sorts them in descending chronological order using the `createdAt` timestamp.

### 4. Customizing User Profiles
- **[useUpdateProfile.js](file:///c:/Users/Kakashi/Desktop/CODE/project/BlogRootReact/src/hooks/useUpdateProfile.js):** 
  - Synchronizes any updates to username or bio fields with the Firestore `users` document under the corresponding UID.
  - Updates the active local storage user details to keep frontend data synced.

---


## 🏃 Getting Started & Setup

To launch this application locally, ensure you have **Node.js** installed, then execute the following:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase Environment
Make sure the credentials inside [Firebase.jsx](file:///c:/Users/Kakashi/Desktop/CODE/project/BlogRootReact/src/Firebase/Firebase.jsx) match your active Firebase Web project configuration.

### 3. Spin Up Developer Server
```bash
npm run dev
```
The server will boot up, usually listening at `http://localhost:5173/`.

### 4. Build for Production
```bash
npm run build
```

---

## ⚠️ Notes for Improvement (Technical Suggestions)

During documentation inspection, the following suggestions and potential bugs were identified:
1. **Absolute Routing in Navbar:**
   The `Navbar.jsx` component uses absolute anchor links pointing to `http://localhost:5173/`. This causes full browser reloads and breaks when deployed to a different URL (like staging or production). 
   *Recommendation:* Swap these links to React Router's `<Link to="/path">` component for true Single Page Application (SPA) navigation.
2. **Missing Reference (`useLogin.js`):**
   In `useLogin.js` on line 12, a function called `showToast` is referenced but never imported or declared. This will trigger a runtime crash if a user clicks login with empty inputs.
   *Recommendation:* Import or write a notification utility (such as `alert()` or a toast library) to replace `showToast`.
3. **Placeholder Hook (`useGetUserById.js`):**
   This hook is defined as a stub that does not query Firestore for users, and is imported in `Home.jsx` but not utilized.
   *Recommendation:* Complete the hook implementation using `getDoc` to clean up unused imports.
