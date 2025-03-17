import { ref } from 'vue';

// Load initial data from localStorage or use empty database
const db = ref(JSON.parse(localStorage.getItem('db') || JSON.stringify({
  users: {},
  cards: {}
})));

// Save database to localStorage
const saveDb = () => {
  localStorage.setItem('db', JSON.stringify(db.value));
};

export const database = {
  collection(path) {
    return {
      async add(data) {
        const id = Math.random().toString(36).substr(2, 9);
        const [collection, userId, subcollection] = path.split('/');
        
        if (!db.value[collection]) {
          db.value[collection] = {};
        }

        if (userId && subcollection) {
          if (!db.value[collection][userId]) {
            db.value[collection][userId] = {};
          }
          if (!db.value[collection][userId][subcollection]) {
            db.value[collection][userId][subcollection] = {};
          }
          db.value[collection][userId][subcollection][id] = { ...data, id };
        } else {
          db.value[collection][id] = { ...data, id };
        }

        saveDb();
        return { id };
      },

      async where() {
        return {
          get: async () => ({
            docs: []
          })
        };
      }
    };
  },

  doc(path) {
    return {
      async get() {
        const parts = path.split('/');
        const id = parts.pop();
        const collection = parts.shift();
        const userId = parts.shift();
        const subcollection = parts.shift();

        let data;
        if (userId && subcollection) {
          data = db.value[collection]?.[userId]?.[subcollection]?.[id];
        } else {
          data = db.value[collection]?.[id];
        }

        return {
          exists: () => !!data,
          data: () => data || null,
          id
        };
      },

      async set(data) {
        const parts = path.split('/');
        const id = parts.pop();
        const collection = parts.shift();
        const userId = parts.shift();
        const subcollection = parts.shift();

        if (userId && subcollection) {
          if (!db.value[collection]) db.value[collection] = {};
          if (!db.value[collection][userId]) db.value[collection][userId] = {};
          if (!db.value[collection][userId][subcollection]) {
            db.value[collection][userId][subcollection] = {};
          }
          db.value[collection][userId][subcollection][id] = { ...data, id };
        } else {
          if (!db.value[collection]) db.value[collection] = {};
          db.value[collection][id] = { ...data, id };
        }

        saveDb();
      },

      async update(updates) {
        const parts = path.split('/');
        const id = parts.pop();
        const collection = parts.shift();
        const userId = parts.shift();
        const subcollection = parts.shift();

        if (userId && subcollection) {
          db.value[collection][userId][subcollection][id] = {
            ...db.value[collection][userId][subcollection][id],
            ...updates
          };
        } else {
          db.value[collection][id] = {
            ...db.value[collection][id],
            ...updates
          };
        }

        saveDb();
      },

      async delete() {
        const parts = path.split('/');
        const id = parts.pop();
        const collection = parts.shift();
        const userId = parts.shift();
        const subcollection = parts.shift();

        if (userId && subcollection) {
          delete db.value[collection][userId][subcollection][id];
        } else {
          delete db.value[collection][id];
        }

        saveDb();
      }
    };
  },

  async getDocs(collectionRef) {
    const path = collectionRef.path;
    const [collection, userId, subcollection] = path.split('/');
    
    let docs = [];
    if (userId && subcollection) {
      const items = db.value[collection]?.[userId]?.[subcollection] || {};
      docs = Object.entries(items).map(([id, data]) => ({
        id,
        data: () => data
      }));
    } else {
      const items = db.value[collection] || {};
      docs = Object.entries(items).map(([id, data]) => ({
        id,
        data: () => data
      }));
    }

    return { docs };
  }
};
