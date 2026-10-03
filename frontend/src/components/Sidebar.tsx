import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import {
  Home,
  List,
  User,
  LogOut,
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface NavItem {
  icon: any;
  label: string;
  path: string;
  requiredRole?: 'USER' | 'ADMIN';
}

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(authService.getCurrentUserFromStorage());
  const [userRole, setUserRole] = useState(authService.getUserRole());

  // Update user info when component mounts or auth state changes
  useEffect(() => {
    const currentUser = authService.getCurrentUserFromStorage();
    const currentRole = authService.getUserRole();
    setUser(currentUser);
    setUserRole(currentRole);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      authService.logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/auth');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // Define all navigation items with role requirements
  const allMenuItems: NavItem[] = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: AlertCircle, label: 'Report Lost', path: '/report-lost', requiredRole: 'USER' },
    { icon: CheckCircle, label: 'Report Found', path: '/report-found', requiredRole: 'USER' },
    { icon: List, label: 'My Items', path: '/my-items', requiredRole: 'USER' },
    { icon: Shield, label: 'Admin Panel', path: '/admin', requiredRole: 'ADMIN' },
  ];

  // Filter menu items based on user role
  const getVisibleMenuItems = (): NavItem[] => {
    if (!userRole) return [];

    return allMenuItems.filter(item => {
      if (!item.requiredRole) return true; // Public items

      // Admin can access everything
      if (userRole === 'ADMIN') return true;

      // User can access USER items only
      if (userRole === 'USER' && item.requiredRole === 'USER') return true;

      return false;
    });
  };

  const visibleMenuItems = getVisibleMenuItems();
  const isLoggedIn = user && userRole;

  const roleBadgeClass = isLoggedIn
    ? userRole === 'ADMIN'
      ? 'bg-amber-100 text-amber-800 border border-amber-300'
      : 'bg-secondary text-secondary-foreground border border-primary/20'
    : 'bg-muted text-muted-foreground border border-border';

  return (
    <div className="w-64 bg-white border-r border-border h-full flex flex-col">
      {/* User Info (logo removed - the main header already shows it) */}
      <div className="px-4 pt-6 pb-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shadow-sm ring-2 ring-primary/20 shrink-0 aspect-square">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{user?.name || 'Guest User'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeClass}`}>
                {isLoggedIn ? userRole : 'Guest'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {visibleMenuItems.length > 0 ? (
            visibleMenuItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start rounded-xl"
                  size="sm"
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                  {item.requiredRole === 'ADMIN' && (
                    <Shield className="w-3 h-3 ml-auto text-destructive" />
                  )}
                </Button>
              </Link>
            ))
          ) : (
            // Only show "No accessible pages" if user is logged in but has no access
            isLoggedIn && (
              <div className="p-4 text-center text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No accessible pages</p>
                <p className="text-xs">Contact administrator</p>
              </div>
            )
          )}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl text-destructive hover:text-destructive"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};
