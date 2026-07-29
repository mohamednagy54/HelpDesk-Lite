import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LifeBuoy, LogOut, Ticket, PlusCircle, LayoutDashboard, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0b0f19]">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-md bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 transition-colors">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-slate-100 tracking-tight">
              HelpDesk <span className="text-indigo-400 font-normal text-xs uppercase tracking-wider ml-0.5">Lite</span>
            </span>
          </NavLink>

          {/* Navigation Links */}
          {!isAuthPage && user && (
            <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
              <NavLink
                to="/my-requests"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-indigo-400 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>My Requests</span>
              </NavLink>

              <NavLink
                to="/new-ticket"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-indigo-400 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Ticket</span>
              </NavLink>

              {(user.role === 'staff' || user.role === 'manager') && (
                <NavLink
                  to="/staff/tickets"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-indigo-400 font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Staff Queue</span>
                </NavLink>
              )}

              {user.role === 'manager' && (
                <NavLink
                  to="/manager/queue"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-indigo-400 font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Manager Queue</span>
                </NavLink>
              )}
            </nav>
          )}
        </div>

        {/* User Info & Actions */}
        {!isAuthPage && user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#111827] border border-slate-800">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-200">{user.name}</span>
              <Badge role={user.role} className="text-[10px] px-1.5 py-0 capitalize" />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const btn = document.getElementById('logout-icon');
                if (btn) btn.classList.add('animate-spin');
                await handleLogout();
              }}
              className="text-xs text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-red-400 gap-1.5 disabled:opacity-50"
            >
              <LogOut id="logout-icon" className="w-3.5 h-3.5" />
              <span>Logout</span>
            </Button>
          </div>
        ) : (
          !isAuthPage && (
            <div className="flex items-center gap-2">
              <NavLink to="/login">
                <Button variant="ghost" size="sm" className="text-xs text-slate-300 hover:bg-slate-800">
                  Log In
                </Button>
              </NavLink>
              <NavLink to="/register">
                <Button variant="default" size="sm" className="text-xs">
                  Register
                </Button>
              </NavLink>
            </div>
          )
        )}
      </div>
    </header>
  );
};
