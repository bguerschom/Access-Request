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
    title: "Administrator's Complete Guide",
    description: "Comprehensive system management and control center. Learn how to effectively manage users, monitor requests, and maintain system security.",
    sections: [
      {
        title: "User Management",
        icon: <Users className="w-6 h-6 text-blue-500" />,
        steps: [
          {
            title: "Creating New Users",
            description: "Add new users by clicking 'Add User' button. Fill in their email, name, and assign appropriate role (Admin, User, or Security Guard)."
          },
          {
            title: "Managing User Access",
            description: "Control user permissions by assigning roles. Each role has specific access rights to different system features."
          },
          {
            title: "Password Management",
            description: "Reset user passwords when needed. Users will receive notification to create new secure passwords."
          },
          {
            title: "Account Maintenance",
            description: "Regularly review user accounts, deactivate unused accounts, and ensure proper role assignments."
          }
        ]
      },
      {
        title: "Request Processing",
        icon: <FileText className="w-6 h-6 text-green-500" />,
        steps: [
          {
            title: "Monitoring Requests",
            description: "View all access requests in real-time. Track status, approval stages, and access durations."
          },
          {
            title: "Request Verification",
            description: "Review request details, ensure proper documentation, and validate access requirements."
          },
          {
            title: "Access Duration Management",
            description: "Set and modify access periods. Monitor expiring access and send notifications."
          },
          {
            title: "Historical Data",
            description: "Access complete history of requests, modifications, and access patterns."
          }
        ]
      },
      {
        title: "System Analytics",
        icon: <BarChart className="w-6 h-6 text-purple-500" />,
        steps: [
          {
            title: "Generating Reports",
            description: "Create detailed reports on access patterns, user activities, and system usage. Export in Excel or PDF format."
          },
          {
            title: "Security Monitoring",
            description: "Track unusual access patterns, multiple entry attempts, and security incidents."
          },
          {
            title: "Performance Metrics",
            description: "Monitor system performance, response times, and user engagement statistics."
          },
          {
            title: "Audit Trails",
            description: "Review comprehensive logs of all system activities and user actions."
          }
        ]
      }
    ]
  },
  user: {
    title: "User Access Guide",
    description: "Learn how to efficiently manage access requests and track their status. This guide will help you navigate through all user features.",
    sections: [
      {
        title: "Creating Access Requests",
        icon: <Upload className="w-6 h-6 text-blue-500" />,
        steps: [
          {
            title: "Prepare Your Request",
            description: "Ensure you have all required documentation in PDF format. Check that all information is clear and complete."
          },
          {
            title: "Upload Process",
            description: "Click 'Upload Request', select your PDF file. The system will automatically extract key information."
          },
          {
            title: "Review & Submit",
            description: "Verify extracted information is correct. Add any additional notes or requirements before submission."
          },
          {
            title: "Track Submission",
            description: "After submission, note your request number for future reference and tracking."
          }
        ]
      },
      {
        title: "Managing Your Requests",
        icon: <Search className="w-6 h-6 text-green-500" />,
        steps: [
          {
            title: "View Active Requests",
            description: "Monitor all your current access requests, their status, and remaining valid periods."
          },
          {
            title: "Request Updates",
            description: "Check request processing status, view security check-in records, and access history."
          },
          {
            title: "Download Records",
            description: "Export request details and documentation for your records or reference."
          },
          {
            title: "Request Modifications",
            description: "If needed, update access duration or details for existing requests."
          }
        ]
      }
    ]
  },
  security: {
    title: "Security Personnel Guide",
    description: "Essential guide for managing and monitoring access control. Learn how to efficiently handle check-ins and maintain security protocols.",
    sections: [
      {
        title: "Visitor Check-in Process",
        icon: <CheckSquare className="w-6 h-6 text-blue-500" />,
        steps: [
          {
            title: "Verify Access Request",
            description: "Search for visitor's access request using their request number or name. Confirm the access is active and valid."
          },
          {
            title: "Identity Verification",
            description: "Check visitor's ID against the request details. Ensure photo ID matches and credentials are valid."
          },
          {
            title: "Recording Entry",
            description: "Log visitor entry with accurate time, ID details, and any additional security requirements."
          },
          {
            title: "Multiple Entries",
            description: "For visitors with recurring access, verify each entry separately and maintain detailed logs."
          }
        ]
      },
      {
        title: "Security Monitoring",
        icon: <Shield className="w-6 h-6 text-green-500" />,
        steps: [
          {
            title: "Active Request Monitoring",
            description: "Keep track of all active access requests. Monitor expiration dates and access limitations."
          },
          {
            title: "Access Violations",
            description: "Know how to handle and report unauthorized access attempts or security breaches."
          },
          {
            title: "Emergency Procedures",
            description: "Understand protocols for emergency situations and system overrides when necessary."
          },
          {
            title: "Daily Reports",
            description: "Maintain and submit daily access logs, incident reports, and security observations."
          }
        ]
      }
    ]
  }
};

  // Add this CSS for enhanced animations
const additionalStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  .float-animation {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes highlight {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .gradient-text {
    background: linear-gradient(45deg, #0A2647, #144272, #0A2647);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: highlight 3s ease infinite;
  }
`;

export default UserGuide;
