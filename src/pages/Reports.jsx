// src/pages/Reports.jsx
import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, Filter, Calendar, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week'); // week, month, year
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    checkedIn: 0
  });

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      const requestsRef = collection(db, 'requests');
      const snapshot = await getDocs(requestsRef);
      const requestData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setRequests(requestData);
      calculateStats(requestData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const currentDate = new Date();
    
    const stats = {
      total: data.length,
      active: data.filter(req => new Date(req.accessEndDate) >= currentDate).length,
      expired: data.filter(req => new Date(req.accessEndDate) < currentDate).length,
      checkedIn: data.filter(req => req.checkedIn).length
    };

    setSummaryStats(stats);
  };

  const exportToExcel = () => {
    const exportData = requests.map(req => ({
      'Request Number': req.requestNumber,
      'Requested For': req.requestedFor,
      'Start Date': new Date(req.accessStartDate).toLocaleDateString(),
      'End Date': new Date(req.accessEndDate).toLocaleDateString(),
      'Status': new Date(req.accessEndDate) >= new Date() ? 'Active' : 'Expired',
      'Checked In': req.checkedIn ? 'Yes' : 'No'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Requests');
    XLSX.writeFile(wb, 'access_requests_report.xlsx');
  };

  // Get data for charts
  const getChartData = () => {
    // Group by month
    const monthlyData = requests.reduce((acc, req) => {
      const month = new Date(req.createdAt).toLocaleString('default', { month: 'long' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      requests: count
    }));
  };

  if (loading) return <div>Loading reports...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <h3 className="text-2xl font-bold mt-2">{summaryStats.total}</h3>
              </div>
              <FileText className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Requests</p>
                <h3 className="text-2xl font-bold mt-2">{summaryStats.active}</h3>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Similar cards for expired and checked-in */}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <Button onClick={exportToExcel}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Request Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#0A2647" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Active', value: summaryStats.active },
                      { name: 'Expired', value: summaryStats.expired }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#0A2647"
                    dataKey="value"
                    label
                  >
                    <Cell fill="#0A2647" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
