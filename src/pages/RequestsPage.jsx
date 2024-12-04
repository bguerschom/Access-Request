// src/pages/RequestsPage.jsx
import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, ExternalLink } from 'lucide-react';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'requests'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requestsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2647]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#0A2647] mb-6">Access Requests</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {requests.map(request => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{request.requestNumber}</span>
                <a
                  href={request.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#0A2647] hover:underline flex items-center"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  View PDF
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Requested For:</span>
                    <p>{request.requestedFor}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">State:</span>
                    <p>{request.state}</p>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Description:</span>
                  <p className="text-sm mt-1">{request.description}</p>
                </div>

                {request.workNotes && (
                  <div>
                    <span className="font-medium text-gray-600">Work Notes:</span>
                    <p className="text-sm mt-1">{request.workNotes}</p>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Uploaded on: {new Date(request.createdAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RequestsPage;
