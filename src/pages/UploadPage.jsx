// src/pages/UploadPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PDFReader } from '@/utils/pdfReader';
import { pdfParser } from '@/utils/pdfParser';
import { requestService } from '@/services/requests';
import { storage, auth } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);

    try {
      // Upload file to storage
      setProgress(25);
      const storageRef = ref(storage, `pdfs/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      // Read PDF content
      setProgress(50);
      const text = await PDFReader.readPDF(file);
      
      // Parse content
      setProgress(75);
      const details = pdfParser.extractRequestDetails(text);

      // Save to database
      await requestService.create({
        ...details,
        userId: auth.currentUser.uid,
        uploadedAt: new Date().toISOString(),
        fileName: file.name,
        fileUrl
      });

      setProgress(100);
      setTimeout(() => {
        navigate('/requests');
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0A2647] mb-6">Upload Access Request</h1>
      
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Upload PDF Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#0A2647] transition-colors"
          >
            {file ? (
              <div className="space-y-4">
                <FileText className="w-16 h-16 text-[#0A2647] mx-auto" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setFile(null)}
                >
                  Remove File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium">Drag and drop your PDF here</p>
                  <p className="text-gray-500">or</p>
                  <label className="mt-2 inline-block">
                    <input
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={handleFileSelect}
                    />
                    <span className="text-[#0A2647] hover:underline cursor-pointer">
                      Browse files
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {progress > 0 && (
            <div className="mt-4 space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#0A2647] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                {uploading ? 'Processing...' : `${progress}% complete`}
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? 'Processing...' : 'Upload Request'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
