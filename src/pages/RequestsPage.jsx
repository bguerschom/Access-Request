// src/pages/RequestsPage.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Clock, CheckCircle } from 'lucide-react';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  const [statusFilter, setStatusFilter] = useState('all');
const [requests, setRequests] = useState([]);

const fetchActiveRequests = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'requests'));
    const currentDate = new Date();
    // Filter requests based on date and arrival status
    const allRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(req => {
        const endDate = new Date(req.accessEndDate);
        return endDate >= currentDate; // Only show non-expired requests
      });

    // Apply status filter
    const filteredRequests = allRequests.filter(req => {
      switch(statusFilter) {
        case 'active':
          return !req.arrivals; // No arrivals recorded yet
        case 'checked':
          return req.arrivals && req.arrivals.length > 0;
        default:
          return true; // Show all non-expired requests
      }
    });

    setRequests(filteredRequests);
  } catch (error) {
    console.error('Error fetching requests:', error);
  }
};

// Filter dropdown in JSX
  <select 
  value={statusFilter} 
  onChange={(e) => setStatusFilter(e.target.value)} 
  className="border rounded-md px-4"
>
  <option value="all">All Active Requests</option>
  <option value="active">Not Checked In</option>
  <option value="checked">Checked In</option>
</select>


    
    
    const activeRequests = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(req => {
        const endDate = new Date(req.accessEndDate);
        return endDate >= currentDate;
      });

    setRequests(activeRequests);
    setLoading(false);
  };

  const handleArrival = async (requestId) => {
    const arrivalInfo = {
      visitorName: prompt('Visitor Name:'),
      visitorId: prompt('Visitor ID:'),
      arrivalTime: new Date().toISOString(),
      checkedBy: auth.currentUser.email
    };

    await updateDoc(doc(db, 'requests', requestId), {
      arrivals: arrayUnion(arrivalInfo)
    });

    fetchActiveRequests();
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Active Access Requests</CardTitle>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search requests..."
                className="px-4 py-2 border rounded-md"
              />
              <select className="border rounded-md px-4">
                <option value="all">All Status</option>
                <option value="pending">Pending Arrival</option>
                <option value="checked">Checked In</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {requests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{request.requestNumber}</h3>
                    <p className="text-sm text-gray-600">{request.requestedFor}</p>
                    <div className="mt-2 text-sm">
                      <p>Access Period: {new Date(request.accessStartDate).toLocaleDateString()} - {new Date(request.accessEndDate).toLocaleDateString()}</p>
                      <p>Description: {request.description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleArrival(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Record Arrival
                  </Button>
                </div>

                {request.arrivals && request.arrivals.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Arrival Records</h4>
                    <div className="space-y-2">
                      {request.arrivals.map((arrival, index) => (
                        <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                          <p>Visitor: {arrival.visitorName} (ID: {arrival.visitorId})</p>
                          <p>Checked in: {new Date(arrival.arrivalTime).toLocaleString()}</p>
                          <p>Verified by: {arrival.checkedBy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsPage;
