# Credit Juggler

A Vue.js application to help manage credit card promotional rates and balance transfers.

## Features

- Track multiple credit cards and their details
- Monitor promotional APR expiration dates
- Configurable email notifications for important dates
- Secure authentication with Firebase
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (project uses v20.19.0)
- npm (v11.2.0 or higher)
- nvm (Node Version Manager)

## Setup

1. Use the correct Node.js version:
```bash
nvm use
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Update the Firebase configuration in `src/firebase.js`

4. Run the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Technology Stack

- Vue.js 3
- Vite
- Tailwind CSS
- Firebase (Authentication & Firestore)
- Pinia (State Management)
- Vue Router
- Headless UI
- Hero Icons
