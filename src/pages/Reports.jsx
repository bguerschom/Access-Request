import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '@/hooks/useAuth';

const Reports = () => {
  const { userData } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: { startDate: '', endDate: '' },
    status: 'all',
    requestedBy: 'all',
    searchTerm: '',
  });
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    checkedIn: 0,
  });
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedExportType, setSelectedExportType] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const requestsRef = collection(db, 'requests');
      const snapshot = await getDocs(requestsRef);
      const requestData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestData);
      calculateStats(requestData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = data => {
    const currentDate = new Date();
    const stats = {
      total: data.length,
      active: data.filter(req => new Date(req.accessEndDate) >= currentDate).length,
      expired: data.filter(req => new Date(req.accessEndDate) < currentDate).length,
      checkedIn: data.filter(req => req.checkedIn).length,
    };
    setSummaryStats(stats);
  };

  const canExport = () => {
    return userData?.role === 'admin' || userData?.role === 'user';
  };

  const getFilteredData = () => {
    return requests.filter(req => {
      const matchesDateRange =
        !filters.dateRange.startDate ||
        !filters.dateRange.endDate ||
        (new Date(req.accessStartDate) >= new Date(filters.dateRange.startDate) &&
          new Date(req.accessStartDate) <= new Date(filters.dateRange.endDate));
      const endDate = new Date(req.accessEndDate);
      const currentDate = new Date();
      const isActive = endDate >= currentDate;
      const matchesStatus =
        filters.status === 'all'
          ? true
          : filters.status === 'active'
          ? isActive
          : filters.status === 'expired'
          ? !isActive
          : filters.status === 'checkedIn'
          ? req.checkedIn
          : true;
      const matchesRequestor =
        filters.requestedBy === 'all' ? true : req.requestedFor === filters.requestedBy;
      const matchesSearch =
        filters.searchTerm === '' ||
        req.requestNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        req.requestedFor.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchesDateRange && matchesStatus && matchesRequestor && matchesSearch;
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
      'Description': req.description,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Access Requests');
    XLSX.writeFile(wb, `access_requests_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const filteredData = getFilteredData();
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Access Request Report', 15, 20);
    doc.autoTable({
      head: [['Request Number', 'Requested For', 'Start Date', 'End Date', 'Status']],
      body: filteredData.map(req => [
        req.requestNumber,
        req.requestedFor,
        new Date(req.accessStartDate).toLocaleDateString(),
        new Date(req.accessEndDate).toLocaleDateString(),
        new Date(req.accessEndDate) >= new Date() ? 'Active' : 'Expired',
      ]),
    });
    doc.save(`access_requests_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const ExportModal = () => {
    if (!showDateModal) return null;
    const handleExport = () => {
      if (selectedExportType === 'excel') {
        exportToExcel();
      } else {
        exportToPDF();
      }
      setShowDateModal(false);
    };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h3 className="text-lg font-semibold mb-4">Select Date Range</h3>
          <div>
            <input
              type="date"
              value={filters.dateRange.startDate}
              onChange={e => setFilters({ ...filters, dateRange: { ...filters.dateRange, startDate: e.target.value } })}
            />
            <input
              type="date"
              value={filters.dateRange.endDate}
              onChange={e => setFilters({ ...filters, dateRange: { ...filters.dateRange, endDate: e.target.value } })}
            />
          </div>
          <Button onClick={handleExport}>Export</Button>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Reports</h1>
      {canExport() && (
        <div>
          <Button onClick={() => {
            setSelectedExportType('excel');
            setShowDateModal(true);
          }}>Export Excel</Button>
          <Button onClick={() => {
            setSelectedExportType('pdf');
            setShowDateModal(true);
          }}>Export PDF</Button>
        </div>
      )}
      <ExportModal />
    </div>
  );
};

export default Reports;
