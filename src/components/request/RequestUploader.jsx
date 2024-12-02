// RequestUploader.jsx
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RequestUploader = () => {
  const [uploading, setUploading] = useState(false);

  const extractRequestDetails = (text) => {
    return {
      requestNumber: text.match(/Number:\s*(RITM\d+)/)?.[1] || '',
      requestedFor: text.match(/Request Requested for:\s*([^\n]+)/)?.[1] || '',
      updatedToOpen: text.match(/Updated to open:\s*([^\n]+)/)?.[1] || '',
      shortDescription: text.match(/Short description:\s*([^\n]+)/)?.[1] || '',
      description: text.match(/Description:\s*([^\n]+)/)?.[1] || '',
      workNotes: text.match(/Work notes:\s*([^\n]+)/)?.[1] || '',
      state: text.match(/State:\s*([^\n]+)/)?.[1] || '',
    };
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      const details = extractRequestDetails(text);
      
      await addDoc(collection(db, 'requests'), {
        ...details,
        userId: auth.currentUser.uid,
        uploadedAt: new Date().toISOString()
      });

      event.target.value = '';
    } catch (error) {
      console.error('Error uploading request:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Request</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
            disabled={uploading}
            className="flex-1"
          />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestUploader;
