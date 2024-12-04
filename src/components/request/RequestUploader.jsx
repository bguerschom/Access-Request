import { useState } from 'react';
import { PDFReader } from '@/utils/pdfReader';
import { pdfParser } from '@/utils/pdfParser';
import { requestService } from '@/services/requests';
import { storage, auth } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle } from 'lucide-react';

const RequestUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file) => {
    const storageRef = ref(storage, `pdfs/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Upload file to storage
      setProgress(20);
      const fileUrl = await uploadFile(file);
      
      // Read and parse PDF
      setProgress(40);
      const text = await PDFReader.readPDF(file);
      setProgress(60);
      const details = pdfParser.extractRequestDetails(text);
      
      // Save to Firestore
      setProgress(80);
      await requestService.create({
        ...details,
        userId: auth.currentUser.uid,
        uploadedAt: new Date().toISOString(),
        fileName: file.name,
        fileUrl
      });

      setProgress(100);
      event.target.value = '';
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error.message || 'Failed to process the file. Please try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Upload Request PDF</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0A2647] focus:border-transparent"
            />
          </div>
          
          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#0A2647] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          {error && (
            <div className="flex items-center space-x-2 text-sm text-red-500 bg-red-50 p-3 rounded">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestUploader;
