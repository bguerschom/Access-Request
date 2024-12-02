// RequestViewer.jsx
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import RequestUploader from './RequestUploader';

const RequestViewer = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'requests'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requestData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <RequestUploader />
        
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {requests.map(request => (
              <Card key={request.id}>
                <CardHeader>
                  <CardTitle>{request.requestNumber}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Requested For:</strong> {request.requestedFor}</p>
                    <p><strong>Updated:</strong> {request.updatedToOpen}</p>
                    <p><strong>Description:</strong> {request.description}</p>
                    <p><strong>Status:</strong> {request.state}</p>
                    {request.workNotes && (
                      <p><strong>Work Notes:</strong> {request.workNotes}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestViewer;
