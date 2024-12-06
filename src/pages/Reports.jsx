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
import { Download, FileText, Filter, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    status: 'all',
    requestedBy: 'all',
    searchTerm: ''
  });
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    checkedIn: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

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
      checkedIn: data.filter(req => req.checkedIn).length,
      uniqueRequestors: new Set(data.map(req => req.requestedFor)).size
    };

    setSummaryStats(stats);
  };

  const getFilteredData = () => {
    return requests.filter(req => {
      const endDate = new Date(req.accessEndDate);
      const currentDate = new Date();
      const isActive = endDate >= currentDate;

      const matchesStatus = 
        filters.status === 'all' ? true :
        filters.status === 'active' ? isActive :
        filters.status === 'expired' ? !isActive :
        filters.status === 'checkedIn' ? req.checkedIn : true;

      const matchesRequestor = 
        filters.requestedBy === 'all' ? true :
        req.requestedFor === filters.requestedBy;

      const matchesSearch = 
        filters.searchTerm === '' ? true :
        req.requestNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        req.requestedFor.toLowerCase().includes(filters.searchTerm.toLowerCase());

      return matchesStatus && matchesRequestor && matchesSearch;
    });
  };

  const exportToExcel = () => {
    const filteredData = getFilteredData();
    const exportData = filteredData.map(req => ({
      'Request Number': req.requestNumber,
      'Requested For': req.requestedFor,
      'Start Date': new Date(req.accessStartDate).toLocaleDateString(),
      'End Date': new Date(req.accessEndDate).toLocaleDateString(),
      'Status': new Date(req.accessEndDate) >= new Date() ? 'Active' : 'Expired',
      'Checked In': req.checkedIn ? 'Yes' : 'No',
      'Check-in Times': req.checkInHistory?.length || 0,
      'Created By': req.uploadedBy,
      'Created Date': new Date(req.createdAt).toLocaleDateString(),
      'Description': req.description,
      'Access Duration (Days)': Math.ceil((new Date(req.accessEndDate) - new Date(req.accessStartDate)) / (1000 * 60 * 60 * 24))
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Requests');
    XLSX.writeFile(wb, 'access_requests_report.xlsx');
  };

  const exportToPDF = () => {
    const filteredData = getFilteredData();
    const doc = new jsPDF();
    
    // Add title and summary
    doc.setFontSize(16);
    doc.text('Access Request Report', 14, 15);
    
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);
    doc.text(`Total Requests: ${summaryStats.total}`, 14, 32);
    doc.text(`Active Requests: ${summaryStats.active}`, 14, 39);
    doc.text(`Expired Requests: ${summaryStats.expired}`, 14, 46);
    
    // Create table
    const tableColumn = [
      "Request Number",
      "Requested For",
      "Status",
      "Start Date",
      "End Date"
    ];
    
    const tableRows = filteredData.map(req => [
      req.requestNumber,
      req.requestedFor,
      new Date(req.accessEndDate) >= new Date() ? 'Active' : 'Expired',
      new Date(req.accessStartDate).toLocaleDateString(),
      new Date(req.accessEndDate).toLocaleDateString()
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [10, 38, 71] }
    });

    doc.save('access_requests_report.pdf');
  };

  const getChartData = () => {
    const filteredData = getFilteredData();
    const monthlyData = filteredData.reduce((acc, req) => {
      const month = new Date(req.createdAt).toLocaleString('default', { month: 'long' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      requests: count
    }));
  };

  if (loading) return <div className="p-8 text-center">Loading reports...</div>;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0A2647]">Access Request Reports</h1>
        <div className="flex space-x-3">
          <Button onClick={exportToExcel}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={exportToPDF}>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
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
                {Array.from(new Set(requests.map(req => req.requestedFor)))
                  .sort()
                  .map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  placeholder="Search requests..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Request Trend</CardTitle>
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
                  <Bar dataKey="requests" fill="#0A2647" name="Requests" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
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
