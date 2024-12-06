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
import { PDFDownloadLink } from '@react-pdf/renderer';

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

    const [filters, setFilters] = useState({
    dateRange: 'all',
    status: 'all',
    requestedBy: 'all',
    searchTerm: ''
  });

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

  // Enhanced statistics calculation
  const calculateStats = (data) => {
    const currentDate = new Date();
    const stats = {
      total: data.length,
      active: data.filter(req => new Date(req.accessEndDate) >= currentDate).length,
      expired: data.filter(req => new Date(req.accessEndDate) < currentDate).length,
      checkedIn: data.filter(req => req.checkedIn).length,
      // Detailed analytics
      uniqueRequestors: new Set(data.map(req => req.requestedFor)).size,
      averageAccessDuration: calculateAverageDuration(data),
      mostFrequentVisitor: findMostFrequent(data, 'requestedFor'),
      weeklyTrend: calculateWeeklyTrend(data)
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
      'Duration (Days)': calculateDuration(req.accessStartDate, req.accessEndDate),
      'Checked In': req.checkedIn ? 'Yes' : 'No',
      'Check-in Times': req.checkInHistory?.length || 0,
      'Last Check-in': req.checkInHistory?.length ? 
        new Date(req.checkInHistory[req.checkInHistory.length - 1].checkInTime).toLocaleString() : 'N/A',
      'Created By': req.uploadedBy,
      'Created Date': new Date(req.createdAt).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Requests');
    XLSX.writeFile(wb, 'detailed_access_requests_report.xlsx');
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
    <div className="p-6 space-y-8">
      {/* Title and Export Options */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0A2647]">Access Request Reports</h1>
        <div className="flex space-x-3">
          <Button onClick={exportToExcel}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <PDFDownloadLink 
            document={<ReportPDF data={requests} stats={summaryStats} />}
            fileName="access_requests_report.pdf"
          >
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </PDFDownloadLink>
        </div>
      </div>

      {/* Interactive Filters */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="w-full border rounded-md p-2"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full border rounded-md p-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="checkedIn">Checked In</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Requested By</label>
              <select
                value={filters.requestedBy}
                onChange={(e) => setFilters({...filters, requestedBy: e.target.value})}
                className="w-full border rounded-md p-2"
              >
                <option value="all">All Users</option>
                {Array.from(new Set(requests.map(req => req.requestedFor))).map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                placeholder="Search requests..."
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="col-span-2 md:col-start-2">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-600">Total Requests</h3>
                <p className="text-4xl font-bold text-[#0A2647] mt-2">{summaryStats.total}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2 md:col-start-2">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-600">Active Requests</h3>
                <p className="text-4xl font-bold text-green-600 mt-2">{summaryStats.active}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requests" fill="#0A2647" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Add more charts and analytics here */}
      </div>
    </div>
  );
};

export default Reports;
