# LinuxWorld Classroom Management App

A comprehensive classroom management platform built for LinuxWorld with Next.js, Firebase, and TypeScript. This application allows administrators to manage students, create groups, post announcements, and handle user approvals.

## About LinuxWorld

This classroom management system is designed specifically for LinuxWorld's educational programs, providing a seamless experience for both instructors and students to manage course content, group activities, and communications.

## Features

### For Administrators
- **User Management**: Approve student registrations and manage user roles
- **Group Management**: Create and organize student groups
- **Announcements**: Post announcements with file attachments to specific groups
- **Admin Creation**: Super admins can create additional admin accounts
- **Dashboard**: Overview of platform statistics and recent activity

### For Students
- **Group Access**: View assigned groups and their information
- **Announcements**: Read announcements and download/view attachments
- **Profile Management**: Update personal information and profile picture

### For Group Admins
- **Limited Admin Access**: Manage announcements for assigned groups
- **Group-specific Management**: Focus on specific group administration

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- Firebase project with Authentication, Firestore, and Storage enabled
- Firebase CLI (optional, for deployment)

## Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd classroom-management-app
npm install
\`\`\`

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Enable Firebase Storage
5. Get your Firebase configuration from Project Settings

### 3. Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

### 4. Firestore Security Rules

Copy and paste these rules in Firebase Console → Firestore → Rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read and write their own user document
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
      
      // Admins can read all users
      allow read: if isAdmin();
      
      // Admins can write to any user document (for approval, group assignment, etc.)
      allow write: if isAdmin();
      
      // Allow user creation during signup (before user document exists)
      allow create: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Groups - readable by all authenticated users, writable by admins
    match /groups/{groupId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Announcements - readable by all authenticated users, writable by admins and group admins
    match /announcements/{announcementId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin', 'group_admin'];
    }
  }
}
\`\`\`

### 5. Create Initial Super Admin

Run the development server and use the browser console to create your first super admin:

\`\`\`bash
npm run dev
\`\`\`

Open your browser console and run:

\`\`\`javascript
// Import the function (you may need to modify the import path)
import { createInitialSuperAdmin } from './scripts/create-initial-admin.ts'

// Create the super admin
createInitialSuperAdmin()
\`\`\`

Or manually create a user through Firebase Authentication and then add a document to the `users` collection with:

\`\`\`json
{
  "email": "admin@example.com",
  "name": "Super Administrator",
  "role": "super_admin",
  "isApproved": true,
  "assignedGroups": [],
  "totalAnnouncementsViewed": 0,
  "mobileNumber": "",
  "profileImage": "",
  "registrationDate": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
\`\`\`

### 6. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` and sign in with your super admin credentials.

## User Roles

### Super Admin
- Full system access
- Can create other admins
- Manage all users, groups, and announcements
- Access to system setup and configuration

### Admin
- Manage users and groups
- Create and manage announcements
- Approve student registrations
- Cannot create other admins

### Group Admin
- Limited to managing specific groups
- Can create announcements for assigned groups
- Cannot manage users or other groups

### Student
- View assigned groups
- Read announcements
- Download/view attachments
- Update own profile

## File Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin-only pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── groups/            # Groups page for students
│   ├── profile/           # Profile management
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # UI components (shadcn/ui)
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── scripts/              # Setup scripts
\`\`\`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
1. Check the GitHub issues
2. Review the setup documentation
3. Ensure Firebase configuration is correct
4. Verify Firestore security rules are applied

## License

This project is developed for LinuxWorld and is licensed under the MIT License.
