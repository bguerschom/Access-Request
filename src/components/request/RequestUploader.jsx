// src/components/layout/Header.jsx
import { LogOut, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-[#0A2647]" />
            <span className="ml-2 text-xl font-bold text-[#0A2647]">Access Request</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-1" />
              <span>{auth.currentUser?.email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

// src/components/request/Dashboard.jsx
import { useState } from 'react';
import Header from '../layout/Header';
import RequestViewer from './RequestViewer';
import RequestUploader from './RequestUploader';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

const Dashboard = () => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#0A2647]">Requests Dashboard</h1>
          <Button
            onClick={() => setShowUpload(!showUpload)}
            className={showUpload ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            {showUpload ? (
              <>
                <X className="h-4 w-4 mr-1" />
                Cancel Upload
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                New Request
              </>
            )}
          </Button>
        </div>

        {showUpload && (
          <div className="mb-6">
            <RequestUploader onUploadComplete={() => setShowUpload(false)} />
          </div>
        )}

        <RequestViewer />
      </main>
    </div>
  );
};

export default Dashboard;

// src/components/request/RequestUploader.jsx
import { useState } from 'react';
import { PDFReader } from '@/utils/pdfReader';
import { pdfParser } from '@/utils/pdfParser';
import { requestService } from '@/services/requests';
import { storage, auth } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, FileText } from 'lucide-react';

const RequestUploader = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const uploadFile = async (file) => {
    const storageRef = ref(storage, `pdfs/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      setProgress(20);
      const fileUrl = await uploadFile(selectedFile);
      
      setProgress(40);
      const text = await PDFReader.readPDF(selectedFile);
      
      setProgress(60);
      const details = pdfParser.extractRequestDetails(text);
      
      setProgress(80);
      await requestService.create({
        ...details,
        userId: auth.currentUser.uid,
        uploadedAt: new Date().toISOString(),
        fileName: selectedFile.name,
        fileUrl
      });

      setProgress(100);
      setSelectedFile(null);
      onUploadComplete?.();
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error.message || 'Failed to process the file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center text-[#0A2647]">
          <Upload className="w-5 h-5 mr-2" />
          Upload New Request
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {selectedFile ? (
              <div className="space-y-2">
                <FileText className="w-8 h-8 text-[#0A2647] mx-auto" />
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedFile(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer inline-flex items-center space-x-2 text-gray-600 hover:text-[#0A2647]"
                >
                  <Upload className="w-6 h-6" />
                  <span>Choose PDF file or drag & drop</span>
                </label>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-sm text-red-500 bg-red-50 p-3 rounded">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {progress > 0 && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#0A2647] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">{progress}% complete</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => onUploadComplete?.()}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? 'Processing...' : 'Upload Request'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestUploader;
