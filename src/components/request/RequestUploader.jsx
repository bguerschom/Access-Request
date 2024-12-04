// src/components/request/RequestUploader.jsx
import { useState } from 'react';
import { PDFReader } from '@/utils/pdfReader';
import { pdfParser } from '@/utils/pdfParser';
import { requestService } from '@/services/requests';
import { auth } from '@/config/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RequestUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Read the PDF file
      const text = await PDFReader.readPDF(file);
      console.log('Extracted text:', text); // For debugging

      // Parse the text content
      const details = pdfParser.extractRequestDetails(text);
      
      // Add metadata and save to Firestore
      await requestService.create({
        ...details,
        userId: auth.currentUser.uid,
        uploadedAt: new Date().toISOString(),
        fileName: file.name
      });

      // Clear the input
      event.target.value = '';
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error.message || 'Failed to process the file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Request PDF</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1 p-2 border rounded"
            />
            {uploading && (
              <div className="text-sm text-blue-500">
                Processing PDF...
              </div>
            )}
          </div>
          
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestUploader;
