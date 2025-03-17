import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase configuration is valid
const isValidConfig = Object.values(firebaseConfig).every(value => 
  value && !value.includes('your_') && value !== 'demo-api-key'
);

let app, db, auth;

if (isValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Create mock objects for development
    app = null;
    db = {
      collection: () => ({
        doc: () => ({
          get: async () => ({ exists: () => false, data: () => ({}) }),
          set: async () => {},
          update: async () => {},
          delete: async () => {}
        }),
        where: () => ({
          get: async () => ({ docs: [] })
        }),
        add: async () => {}
      })
    };
    auth = {
      currentUser: null,
      onAuthStateChanged: (callback) => callback(null),
      signInWithEmailAndPassword: async () => { throw new Error('Firebase not configured') },
      createUserWithEmailAndPassword: async () => { throw new Error('Firebase not configured') },
      signOut: async () => {}
    };
  }
} else {
  console.warn('Firebase configuration not found. Running in development mode.');
  // Create mock objects for development
  app = null;
  db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: () => false, data: () => ({}) }),
        set: async () => {},
        update: async () => {},
        delete: async () => {}
      }),
      where: () => ({
        get: async () => ({ docs: [] })
      }),
      add: async () => {}
    })
  };
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => callback(null),
    signInWithEmailAndPassword: async () => { throw new Error('Firebase not configured') },
    createUserWithEmailAndPassword: async () => { throw new Error('Firebase not configured') },
    signOut: async () => {}
  };
}

export { db, auth, app };
