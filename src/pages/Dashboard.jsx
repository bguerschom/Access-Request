// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Users, 
  FileCheck, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalUsers: 0,
    recentActivity: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch requests statistics
      const requestsRef = collection(db, 'requests');
      const requestsSnapshot = await getDocs(requestsRef);
      const requests = requestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch users count
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);

      // Get recent activity
      const recentRef = query(
        collection(db, 'requests'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentSnapshot = await getDocs(recentRef);
      const recentActivity = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setStats({
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.state === 'pending').length,
        approvedRequests: requests.filter(r => r.state === 'approved').length,
        rejectedRequests: requests.filter(r => r.state === 'rejected').length,
        totalUsers: usersSnapshot.size,
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const pieData = [
    { name: 'Pending', value: stats.pendingRequests },
    { name: 'Approved', value: stats.approvedRequests },
    { name: 'Rejected', value: stats.rejectedRequests }
  ];

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full p-3 bg-blue-100">
              <FileCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <h3 className="text-2xl font-bold">{stats.totalRequests}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full p-3 bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <h3 className="text-2xl font-bold">{stats.approvedRequests}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full p-3 bg-yellow-100">
              <Clock3 className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <h3 className="text-2xl font-bold">{stats.pendingRequests}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full p-3 bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <h3 className="text-2xl font-bold">{stats.rejectedRequests}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                      name
                    }) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {`${name} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
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
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`rounded-full p-2 ${
                    activity.state === 'approved' ? 'bg-green-100' :
                    activity.state === 'rejected' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    {activity.state === 'approved' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : activity.state === 'rejected' ? (
                      <XCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <Clock3 className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.requestNumber}</p>
                    <p className="text-xs text-gray-500">
                      Requested by {activity.requestedFor}
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleDateString()}
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
