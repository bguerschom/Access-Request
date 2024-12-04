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
    state: ''
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
      setFile(file);
      const text = await PDFReader.readPDF(file);
      
      const data = {
        requestNumber: text.match(/Number:\s*(RITM\d+)/)?.[1] || '',
        requestedFor: text.match(/Request Requested for:\s*(.*?)\s*Company:/s)?.[1]?.trim() || '',
        updatedToOpen: text.match(/Updated to open:\s*([^\n]+)/)?.[1] || '',
        shortDescription: text.match(/Short description:\s*([^\n]+)/)?.[1] || '',
        description: text.match(/Description:\s*([^\n]+)/)?.[1] || '',
        workNotes: text.match(/Work notes:\s*([^\n]+)/)?.[1] || '',
        state: text.match(/State:\s*([^\n]+)/)?.[1] || ''
      };

          // Clean the requestedFor field by removing the prefix if it's still there
    if (data.requestedFor.startsWith('Request Requested for:')) {
      data.requestedFor = data.requestedFor.replace('Request Requested for:', '').trim();
    }

      setExtractedData(data);
      setFormData(data);
    } catch (error) {
      console.error('Error processing PDF:', error);
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
      state: ''
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
