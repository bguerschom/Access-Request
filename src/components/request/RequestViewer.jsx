import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRequest } from '@/hooks/useRequest';
import { requestService } from '@/services/requests';
import { Edit2, FileText, Save, X } from 'lucide-react';

const RequestViewer = () => {
  const { requests, loading } = useRequest();
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const handleEdit = (request) => {
    setEditingId(request.id);
    setEditedData(request);
  };

  const handleSave = async (id) => {
    try {
      await requestService.update(id, editedData);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#0A2647] mb-8">Access Requests</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {loading ? (
            <div className="col-span-2 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2647] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-white rounded-lg shadow">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No requests found</p>
            </div>
          ) : (
            requests.map((request) => (
              <Card key={request.id} className="relative hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-semibold text-[#0A2647]">
                    {request.requestNumber}
                  </CardTitle>
                  <div className="flex space-x-2">
                    {editingId === request.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSave(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(request)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {editingId === request.id ? (
                      // Edit mode
                      <div className="space-y-3">
                        <input
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0A2647] focus:border-transparent"
                          value={editedData.requestedFor || ''}
                          onChange={(e) => setEditedData({
                            ...editedData,
                            requestedFor: e.target.value
                          })}
                        />
                        <textarea
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0A2647] focus:border-transparent"
                          value={editedData.description || ''}
                          onChange={(e) => setEditedData({
                            ...editedData,
                            description: e.target.value
                          })}
                        />
                        <input
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0A2647] focus:border-transparent"
                          value={editedData.state || ''}
                          onChange={(e) => setEditedData({
                            ...editedData,
                            state: e.target.value
                          })}
                        />
                      </div>
                    ) : (
                      // View mode
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Requested For</span>
                          <span className="text-sm text-gray-900">{request.requestedFor}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">State</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.state === 'Approved' ? 'bg-green-100 text-green-800' :
                            request.state === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.state}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 block mb-1">Description</span>
                          <p className="text-sm text-gray-900">{request.description}</p>
                        </div>
                        {request.workNotes && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 block mb-1">Work Notes</span>
                            <p className="text-sm text-gray-900">{request.workNotes}</p>
                          </div>
                        )}
                        {request.fileUrl && (
                          <div className="pt-2">
                            <a
                              href={request.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-[#0A2647] hover:underline"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              View Original PDF
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestViewer;
