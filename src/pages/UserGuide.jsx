// src/pages/UserGuide.jsx
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  FileText, 
  Users, 
  Shield, 
  CheckSquare, 
  Calendar, 
  Search,
  Settings,
  BarChart
} from 'lucide-react';

const UserGuide = () => {
  const { userData } = useAuth();

  // Content for different roles
  const guideContent = {
    admin: {
      title: "Admin User Guide",
      description: "Complete system management and oversight capabilities",
      sections: [
        {
          title: "User Management",
          icon: <Users className="w-6 h-6 text-blue-500" />,
          steps: [
            "Create and manage user accounts",
            "Assign user roles and permissions",
            "Reset user passwords",
            "Deactivate user accounts when needed"
          ]
        },
        {
          title: "Request Management",
          icon: <FileText className="w-6 h-6 text-green-500" />,
          steps: [
            "Upload and process access requests",
            "Monitor all active requests",
            "View request history",
            "Generate comprehensive reports"
          ]
        },
        {
          title: "Reports & Analytics",
          icon: <BarChart className="w-6 h-6 text-purple-500" />,
          steps: [
            "Access detailed system reports",
            "Export data in various formats",
            "Monitor system usage trends",
            "Track user activities"
          ]
        }
      ]
    },
    user: {
      title: "User Guide",
      description: "Learn how to manage access requests efficiently",
      sections: [
        {
          title: "Submitting Requests",
          icon: <Upload className="w-6 h-6 text-blue-500" />,
          steps: [
            "Upload access request documents",
            "Fill in required information",
            "Review request details",
            "Submit for processing"
          ]
        },
        {
          title: "Tracking Requests",
          icon: <Search className="w-6 h-6 text-green-500" />,
          steps: [
            "View your submitted requests",
            "Check request status",
            "View request history",
            "Download request details"
          ]
        }
      ]
    },
    security: {
      title: "Security Guard Guide",
      description: "Manage and track visitor access efficiently",
      sections: [
        {
          title: "Check-in Process",
          icon: <CheckSquare className="w-6 h-6 text-blue-500" />,
          steps: [
            "Verify visitor credentials",
            "Record check-in details",
            "Monitor access duration",
            "Handle multiple check-ins"
          ]
        },
        {
          title: "Access Management",
          icon: <Shield className="w-6 h-6 text-green-500" />,
          steps: [
            "View active access requests",
            "Verify access permissions",
            "Track visitor movements",
            "Report security concerns"
          ]
        }
      ]
    }
  };

  const currentGuide = guideContent[userData?.role || 'user'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-[#0A2647] mb-2">
          {currentGuide.title}
        </h1>
        <p className="text-gray-600">{currentGuide.description}</p>
      </div>

      {/* Quick Start Guide */}
      <Card className="mb-8 animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-[#0A2647]" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-green-500" />
            <div className="pl-6 space-y-4">
              {currentGuide.sections[0].steps.map((step, index) => (
                <div 
                  key={index}
                  className="transform hover:translate-x-2 transition-transform duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-[#0A2647] text-white flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {currentGuide.sections.map((section, index) => (
          <Card 
            key={section.title}
            className="transform hover:scale-[1.02] transition-transform duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                {section.icon}
                <span className="ml-2">{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {section.steps.map((step, stepIndex) => (
                  <li 
                    key={stepIndex}
                    className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#0A2647]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#0A2647]" />
                    </div>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserGuide;
