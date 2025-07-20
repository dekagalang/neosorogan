
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  User, 
  Users, 
  FileText,
  Star,
  Settings,
  Activity
} from 'lucide-react';

const Sidebar = () => {
  const { userRole } = useAuth();

  const getNavItems = () => {
    switch (userRole) {
      case 'student':
        return [
          { path: '/dashboard/student', icon: Home, label: 'Dashboard' },
          { path: '/student/tasks', icon: BookOpen, label: 'Daily Tasks' },
          { path: '/student/materials', icon: FileText, label: 'Materials' },
          { path: '/student/profile', icon: User, label: 'Profile' },
        ];
      case 'teacher':
        return [
          { path: '/dashboard/teacher', icon: Home, label: 'Dashboard' },
          { path: '/teacher/classes', icon: Users, label: 'Classes' },
          { path: '/teacher/materials', icon: FileText, label: 'Materials' },
          { path: '/teacher/tasks', icon: Star, label: 'Review Tasks' },
        ];
      case 'admin':
        return [
          { path: '/dashboard/admin', icon: Home, label: 'Dashboard' },
          { path: '/admin/users', icon: Users, label: 'Users' },
          { path: '/admin/logs', icon: Activity, label: 'Logs' },
          { path: '/admin/settings', icon: Settings, label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-[calc(100vh-80px)]">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
