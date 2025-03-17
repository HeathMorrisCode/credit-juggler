import { ref } from 'vue';

const currentUser = ref(JSON.parse(localStorage.getItem('user') || 'null'));
const isAuthenticated = ref(!!currentUser.value);

export const auth = {
  currentUser,
  isAuthenticated,

  async signIn(email, password) {
    // Simple email validation
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }
    // Simple password validation
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const user = {
      uid: btoa(email).replace(/=/g, ''),
      email,
    };

    localStorage.setItem('user', JSON.stringify(user));
    currentUser.value = user;
    isAuthenticated.value = true;
  },

  async signUp(email, password) {
    return this.signIn(email, password);
  },

  async signOut() {
    localStorage.removeItem('user');
    currentUser.value = null;
    isAuthenticated.value = false;
  },

  onAuthStateChanged(callback) {
    // Initial call
    callback(currentUser.value);

    // Set up a simple event listener for storage changes
    window.addEventListener('storage', (event) => {
      if (event.key === 'user') {
        currentUser.value = JSON.parse(event.newValue);
        isAuthenticated.value = !!currentUser.value;
        callback(currentUser.value);
      }
    });

    return () => {
      window.removeEventListener('storage', callback);
    };
  }
};
