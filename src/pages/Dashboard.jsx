// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { auth } from '@/config/firebase';
import { Upload, CheckCircle, ClipboardList, Users } from 'lucide-react';

const Dashboard = () => {
  // Get current user's email or name
  const userEmail = auth.currentUser?.email;

  return (
    <div className="p-6">
      {/* Welcome Message */}
      <Card className="mb-6 bg-gradient-to-r from-[#0A2647] to-[#144272]">
        <CardContent className="p-8">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-lg opacity-90">{userEmail}</p>
            <p className="mt-4 opacity-80">
              Manage and track access requests efficiently with our system.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Animation */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center py-8 px-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center max-w-xs p-4 transform transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-[#0A2647]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload Request</h3>
              <p className="text-gray-600">
                Upload your access request document and our system will automatically extract the details.
              </p>
            </div>

            {/* Connector */}
            <div className="hidden md:block text-gray-300 text-2xl">→</div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center max-w-xs p-4 transform transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Security Check-In</h3>
              <p className="text-gray-600">
                Security guards verify and record visitor access with detailed check-in information.
              </p>
            </div>

            {/* Connector */}
            <div className="hidden md:block text-gray-300 text-2xl">→</div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center max-w-xs p-4 transform transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track & Monitor</h3>
              <p className="text-gray-600">
                Keep track of all access requests, check-in history, and manage access permissions.
              </p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600">1</span>
                </div>
                <p className="text-sm text-gray-600">
                  Upload PDF files containing access request details for automatic processing
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600">2</span>
                </div>
                <p className="text-sm text-gray-600">
                  Monitor expiration dates to ensure timely access management
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600">3</span>
                </div>
                <p className="text-sm text-gray-600">
                  Record visitor details during check-in for comprehensive tracking
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600">4</span>
                </div>
                <p className="text-sm text-gray-600">
                  Review check-in history to maintain security compliance
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
