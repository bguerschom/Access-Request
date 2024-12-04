import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, FileText, Save, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { storage, auth, db } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { PDFReader } from '@/utils/pdfReader';

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    requestNumber: '',
    requestedFor: '',
    updatedToOpen: '',
    shortDescription: '',
    description: '',
    workNotes: '',
    state: '',
    approvals: [] 
  });

  // Handle file drop
  const handleDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      await processFile(droppedFile);
    } else {
      setError('Please upload a PDF file');
    }
  };

  // Handle file selection
  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') {
      await processFile(selectedFile);
    } else {
      setError('Please upload a PDF file');
    }
  };

  // Process PDF file
const processFile = async (file) => {
  setLoading(true);
  setError(null);
   try {
    const text = await PDFReader.readPDF(file);
    console.log("Starting approval extraction");

    const approvals = [];
    let searchText = text;
    let startIndex = 0;
    let count = 0;
    let foundFirst = false;
     
    // Find all lines containing 'Approved'
    const lines = text.split('\n')
      .filter(line => line.includes('Approved'))
      .map(line => line.trim());

    console.log("Found approved lines:", lines);

    // Get second and third lines (index 1 and 2)
    for (let i = 1; i < 3; i++) {
      const line = lines[i];
      if (line) {
        try {
          // Split by 'Approved' first
          const [_, rest] = line.split('Approved');
          if (rest) {
            // Find the timestamps
            const timeMatch = rest.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/);
            if (timeMatch) {
              // Get content before timestamps
              const beforeTimes = rest.split(timeMatch[1])[0].trim();
              // Get approver (first two words) and item (rest)
              const words = beforeTimes.trim().split(/\s+/);
              const approver = words.slice(0, 2).join(' ');
              const item = words.slice(2).join(' ');

              approvals.push({
                state: 'Approved',
                approver: approver.trim(),
                item: item.trim(),
                created: timeMatch[1],
                createdOriginal: timeMatch[2]
              });
            }
          }
        } catch (err) {
          console.log("Error processing line:", err);
        }
      }
    }

    console.log("Final approvals:", approvals);
      
      
      const data = {
        requestNumber: text.match(/Number:\s*(RITM\d+)/)?.[1] || '',
        requestedFor: text.match(/Request Requested for:\s*(.*?)\s*Company:/s)?.[1]?.trim() || '',
        updatedToOpen: text.match(/Opened:\s*(.*?)\s*Closed:/s)?.[1]?.trim() || '',
        shortDescription: text.match(/Short description:\s*(.*?)\s*Description:/s)?.[1]?.trim() || '',
        description: text.match(/Description:\s*(.*?)\s*Approver:/s)?.[1]?.trim() || '',
        workNotes: text.match(/Work notes:\s*(.*?)\s*Additional comments:/s)?.[1]?.trim() || '',
        state: text.match(/State:\s*(.*?)\s*Priority:/s)?.[1]?.trim() || '',
        approvals
 
      };



    console.log("Final data:", data);
    setExtractedData(data);
    setFormData(data);
  } catch (error) {
    console.error('Error in processFile:', error);
    setError('Failed to process PDF file');
  } finally {
    setLoading(false);
  }
};

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Upload PDF to Firebase Storage
      const storageRef = ref(storage, `pdfs/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      // Save data to Firestore
      await addDoc(collection(db, 'requests'), {
        ...formData,
        fileUrl,
        fileName: file.name,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        originalData: extractedData
      });

      // Navigate to requests page
      navigate('/requests');
    } catch (error) {
      console.error('Error saving request:', error);
      setError('Failed to save request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
const handleReset = () => {
  setFile(null);
  setExtractedData(null);
  setFormData({
    requestNumber: '',
    requestedFor: '',
    updatedToOpen: '',
    shortDescription: '',
    description: '',
    workNotes: '',
    state: '',
    approvals: [] 
  });
};

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Access Request</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!extractedData ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <FileText className="w-12 h-12 text-gray-400" />
                <span className="text-gray-600">Click to upload or drag and drop PDF</span>
                <span className="text-sm text-gray-500">Only PDF files are supported</span>
              </label>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Request Number
                  </label>
                  <input
                    type="text"
                    name="requestNumber"
                    value={formData.requestNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#0A2647] focus:ring-[#0A2647]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requested For
                  </label>
                  <input
                    type="text"
                    name="requestedFor"
                    value={formData.requestedFor}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#0A2647] focus:ring-[#0A2647]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Updated To Open
                </label>
                <input
                  type="text"
                  name="updatedToOpen"
                  value={formData.updatedToOpen}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#0A2647] focus:ring-[#0A2647]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#0A2647] focus:ring-[#0A2647]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#0A2647] focus:ring-[#0A2647]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Notes
                </label>
                <textarea
                  name="workNotes"
                  value={formData.workNotes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#0A2647] focus:ring-[#0A2647]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#0A2647] focus:ring-[#0A2647]"
                />
              </div>

  <div className="mt-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Approvals
    </label>
    <div className="bg-gray-50 rounded-md p-4">
      <div className="grid grid-cols-4 gap-4 mb-2 text-sm font-medium text-gray-600">
        <div>State</div>
        <div>Approver</div>
        <div>Item</div>
        <div>Created</div>
      </div>
      {formData.approvals.map((approval, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 text-sm border-t py-2">
          <div>
            <input
              type="text"
              value={approval.state}
              onChange={(e) => {
                const newApprovals = [...formData.approvals];
                newApprovals[index] = {
                  ...approval,
                  state: e.target.value
                };
                setFormData({
                  ...formData,
                  approvals: newApprovals
                });
              }}
              className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-[#0A2647] focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="text"
              value={approval.approver}
              onChange={(e) => {
                const newApprovals = [...formData.approvals];
                newApprovals[index] = {
                  ...approval,
                  approver: e.target.value
                };
                setFormData({
                  ...formData,
                  approvals: newApprovals
                });
              }}
              className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-[#0A2647] focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="text"
              value={approval.item}
              onChange={(e) => {
                const newApprovals = [...formData.approvals];
                newApprovals[index] = {
                  ...approval,
                  item: e.target.value
                };
                setFormData({
                  ...formData,
                  approvals: newApprovals
                });
              }}
              className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-[#0A2647] focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="text"
              value={approval.created}
              onChange={(e) => {
                const newApprovals = [...formData.approvals];
                newApprovals[index] = {
                  ...approval,
                  created: e.target.value
                };
                setFormData({
                  ...formData,
                  approvals: newApprovals
                });
              }}
              className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-[#0A2647] focus:border-transparent"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={loading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0A2647]"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
