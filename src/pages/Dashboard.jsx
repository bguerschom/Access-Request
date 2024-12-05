// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';  // Add these imports
import { db, auth } from '@/config/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload, CheckCircle, ClipboardList, Users, FileText } from 'lucide-react';


const Dashboard = () => {
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
  fetchRecentActivities();
}, []);

  const fetchRecentActivities = async () => {
  try {
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      orderBy('timestamp', 'desc'),
      limit(5)  // Get only last 5 activities
    );
    
    const snapshot = await getDocs(q);
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('Fetched activities:', activities);
    setRecentActivity(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
  }
};
  
  // Format email to show only name
  const userName = auth.currentUser?.email.split('@')[0]
    .split('.')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="p-6">
      {/* Welcome Message with Animation */}
      <Card className="mb-6 overflow-hidden relative bg-gradient-to-r from-[#0A2647] to-[#144272]">
        <div className="absolute inset-0">
          <div className="animate-float absolute top-10 left-10 opacity-10">
            <FileText className="w-20 h-20 text-white" />
          </div>
          <div className="animate-float-delayed absolute bottom-10 right-10 opacity-10">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
        </div>
        <CardContent className="p-12 flex items-center justify-center relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome, {userName}!</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Experience paperless efficiency in managing access requests. 
              Track, report, and maintain records with ease.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Animated Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>System Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 animate-slide-in">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Paperless Environment</h3>
                  <p className="text-gray-600">Reduce paper waste and storage needs</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 animate-slide-in-delayed-1">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Easy Reporting</h3>
                  <p className="text-gray-600">Generate reports with a few clicks</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 animate-slide-in-delayed-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Efficient File Management</h3>
                  <p className="text-gray-600">Quick access to historical data</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg animate-fade-in">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'check-in' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'check-in' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
