import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// NOTE: Firebase config values are not secret — access is protected by
// Firestore security rules and Authentication, not by hiding these keys.
const firebaseConfig = {
  apiKey: 'AIzaSyC5cgfug1lsdzKi6_HpkJx1FD8oTKOBPHk',
  authDomain: 'bm-office-manager.firebaseapp.com',
  projectId: 'bm-office-manager',
  storageBucket: 'bm-office-manager.firebasestorage.app',
  messagingSenderId: '93154677706',
  appId: '1:93154677706:web:7b1bc7b0a5656a9bd4b533',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
