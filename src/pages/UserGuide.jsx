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
  BarChart2,
  ArrowRight,
  BookOpen,
  Info
} from 'lucide-react';

const UserGuide = () => {
  const { userData } = useAuth();

  const guideContent = {
    admin: {
      title: "Administrator Guide",
      description: "Complete system management and control center. Learn how to effectively manage users, monitor requests, and maintain system security.",
      sections: [
        {
          title: "System Overview",
          icon: <Info className="w-6 h-6 text-blue-500" />,
          steps: [
            {
              title: "Dashboard Navigation",
              description: "Access key metrics, recent activities, and system status at a glance. Monitor total requests, active requests, and system health."
            },
            {
              title: "System Configuration",
              description: "Set up system preferences, notification settings, and security parameters through the settings panel."
            }
          ]
        },
        {
          title: "User Management",
          icon: <Users className="w-6 h-6 text-green-500" />,
          steps: [
            {
              title: "Creating New Users",
              description: "Click 'Add User' in the User Management section. Fill in required details: email, name, role (Admin, User, Security). Users will receive setup instructions."
            },
            {
              title: "Managing Existing Users",
              description: "Edit user roles, reset passwords, or deactivate accounts when needed. All changes are logged for security."
            },
            {
              title: "Role Assignment",
              description: "Assign appropriate roles to control system access: Admin (full access), User (request management), Security (access verification)."
            }
          ]
        },
        {
          title: "Request Management",
          icon: <FileText className="w-6 h-6 text-purple-500" />,
          steps: [
            {
              title: "Processing Requests",
              description: "Review incoming requests, verify documentation, and track request status through the system."
            },
            {
              title: "Access Control",
              description: "Set access durations, approve or deny requests, and manage access permissions across the system."
            }
          ]
        }
      ]
    },
    user: {
      title: "User Access Guide",
      description: "Learn to manage access requests effectively. Follow these steps to submit and track your requests.",
      sections: [
        {
          title: "Submitting Requests",
          icon: <Upload className="w-6 h-6 text-blue-500" />,
          steps: [
            {
              title: "Prepare Your Documents",
              description: "Ensure your PDF document contains all required information: personal details, access requirements, and duration needed."
            },
            {
              title: "Upload Process",
              description: "Click 'Upload Request', select your PDF. The system automatically extracts information. Review for accuracy before submission."
            },
            {
              title: "Setting Access Duration",
              description: "Specify your required access period. The system will automatically track and notify of expiration."
            }
          ]
        },
        {
          title: "Managing Requests",
          icon: <Search className="w-6 h-6 text-green-500" />,
          steps: [
            {
              title: "Tracking Status",
              description: "Monitor your request status in real-time. View approval stages and access grant details."
            },
            {
              title: "Access History",
              description: "Review past requests, check-in records, and download request details when needed."
            }
          ]
        }
      ]
    },
    security: {
      title: "Security Personnel Guide",
      description: "Essential guide for managing access control and maintaining security protocols.",
      sections: [
        {
          title: "Daily Operations",
          icon: <Shield className="w-6 h-6 text-blue-500" />,
          steps: [
            {
              title: "Access Verification",
              description: "Search for requests using the request number or visitor name. Verify active status and validity period."
            },
            {
              title: "Visitor Check-in",
              description: "Record visitor details, check identification, and log entry time in the system."
            },
            {
              title: "Managing Multiple Visitors",
              description: "Handle group access requests and maintain accurate check-in records for each visitor."
            }
          ]
        },
        {
          title: "Security Protocols",
          icon: <CheckSquare className="w-6 h-6 text-green-500" />,
          steps: [
            {
              title: "Emergency Procedures",
              description: "Know the steps for emergency access management and system override protocols when necessary."
            },
            {
              title: "Reporting Incidents",
              description: "Document and report security concerns, unauthorized access attempts, or suspicious activities."
            }
          ]
        }
      ]
    }
  };

  const currentGuide = guideContent[userData?.role || 'user'];

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Guide Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-[#0A2647] dark:text-white mb-2 gradient-text">
          {currentGuide.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">{currentGuide.description}</p>
      </div>

      {/* Quick Navigation */}
      <Card className="mb-8 bg-white dark:bg-gray-800 animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center text-[#0A2647] dark:text-white">
            <BookOpen className="w-5 h-5 mr-2" />
            Quick Navigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {currentGuide.sections.map((section, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#0A2647] dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      <div className="space-y-8">
        {currentGuide.sections.map((section, index) => (
          <Card 
            key={section.title}
            className="bg-white dark:bg-gray-800 transform hover:scale-[1.01] transition-transform duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-[#0A2647] dark:text-white">
                {section.icon}
                <span className="ml-2">{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {section.steps.map((step, stepIndex) => (
                  <div 
                    key={stepIndex}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <h4 className="font-medium text-[#0A2647] dark:text-white flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {step.title}
                    </h4>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 ml-6">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserGuide;
