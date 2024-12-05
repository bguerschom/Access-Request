// src/pages/RequestsPage.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, arrayUnion, where, query } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle, Calendar } from 'lucide-react';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRequests = async () => {
    try {
      // Basic query to get all requests
      const q = query(collection(db, 'requests'));
      const querySnapshot = await getDocs(q);
      
      // Log the raw data
      console.log('Raw data:', querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      if (querySnapshot.empty) {
        console.log('No requests found');
        setRequests([]);
        setLoading(false);
        return;
      }

      const currentDate = new Date();
      let filteredRequests = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(req => {
          // Only include requests that have dates
          if (!req.accessEndDate) {
            console.log('Request missing end date:', req);
            return false;
          }
          
          const endDate = new Date(req.accessEndDate);
          return endDate >= currentDate;
        });

      console.log('Filtered by date:', filteredRequests);

      // Apply status filter
      if (statusFilter === 'active') {
        filteredRequests = filteredRequests.filter(req => !req.checkInHistory?.length);
      } else if (statusFilter === 'checked') {
        filteredRequests = filteredRequests.filter(req => req.checkInHistory?.length > 0);
      }

      console.log('Final filtered requests:', filteredRequests);
      setRequests(filteredRequests);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

 const handleCheckIn = async (requestId) => {
   const checkInInfo = {
     visitorName: prompt('Visitor Name:'),
     visitorId: prompt('Visitor ID:'),
     checkInTime: new Date().toISOString(),
     checkedBy: auth.currentUser.email
   };

   if (checkInInfo.visitorName && checkInInfo.visitorId) {
     try {
       await updateDoc(doc(db, 'requests', requestId), {
         checkedIn: true,
         checkInHistory: arrayUnion(checkInInfo)
       });
       fetchRequests();
     } catch (error) {
       console.error('Error updating check-in:', error);
     }
   }
 };

 const getDaysRemaining = (endDate) => {
   const end = new Date(endDate);
   const today = new Date();
   const diffTime = end - today;
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   return diffDays;
 };

 if (loading) return <div>Loading...</div>;

 return (
   <div className="p-6">
     <Card>
       <CardHeader>
         <div className="flex justify-between items-center">
           <CardTitle>Access Requests</CardTitle>
           <div className="flex space-x-4">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
               <input
                 type="text"
                 placeholder="Search requests..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10 pr-4 py-2 border rounded-md"
               />
             </div>
             <select
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="border rounded-md px-4"
             >
               <option value="all">All Active Requests</option>
               <option value="active">Not Checked In</option>
               <option value="checked">Checked In</option>
             </select>
           </div>
         </div>
       </CardHeader>
       <CardContent>
         <div className="grid gap-4">
           {requests.map((request) => (
             <div key={request.id} 
               className={`border rounded-lg p-4 ${
                 getDaysRemaining(request.accessEndDate) <= 3 ? 'border-yellow-500' : ''
               }`}
             >
               <div className="flex justify-between items-start">
                 <div>
                   <div className="flex items-center space-x-2">
                     <h3 className="font-medium">{request.requestNumber}</h3>
                     {request.checkedIn && (
                       <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                         Checked In
                       </span>
                     )}
                   </div>
                   <p className="text-sm text-gray-600">{request.requestedFor}</p>
                   <div className="mt-2 text-sm space-y-1">
                     <p className="flex items-center">
                       <Calendar className="w-4 h-4 mr-2" />
                       Access Period: {new Date(request.accessStartDate).toLocaleDateString()} - {new Date(request.accessEndDate).toLocaleDateString()}
                       <span className="ml-2 text-gray-500">
                         ({getDaysRemaining(request.accessEndDate)} days remaining)
                       </span>
                     </p>
                     {request.description && (
                       <p>Description: {request.description}</p>
                     )}
                   </div>
                 </div>
                 {!request.checkedIn && (
                   <Button
                     onClick={() => handleCheckIn(request.id)}
                     className="bg-green-600 hover:bg-green-700"
                   >
                     <CheckCircle className="w-4 h-4 mr-2" />
                     Check In
                   </Button>
                 )}
               </div>

               {request.checkInHistory && request.checkInHistory.length > 0 && (
                 <div className="mt-4">
                   <h4 className="font-medium mb-2">Check-in History</h4>
                   <div className="space-y-2">
                     {request.checkInHistory.map((checkIn, index) => (
                       <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                         <p>Visitor: {checkIn.visitorName} (ID: {checkIn.visitorId})</p>
                         <p>Checked in: {new Date(checkIn.checkInTime).toLocaleString()}</p>
                         <p>Verified by: {checkIn.checkedBy}</p>
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
