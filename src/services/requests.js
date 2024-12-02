// src/services/requests.js
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const requestService = {
  create: async (requestData) => {
    try {
      const docRef = await addDoc(collection(db, 'requests'), requestData);
      return { id: docRef.id, error: null };
    } catch (error) {
      return { id: null, error: error.message };
    }
  },

  update: async (id, updates) => {
    try {
      await updateDoc(doc(db, 'requests', id), updates);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'requests', id));
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }
};
