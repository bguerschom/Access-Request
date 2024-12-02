
// src/hooks/useRequest.js
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';

export const useRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'requests'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        setRequests(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { requests, loading, error };
};
