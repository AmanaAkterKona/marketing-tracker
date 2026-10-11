import React, { useEffect, useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { api } from '../../lib/api';
import { AdminUser } from '../../types';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  Plus,
  ShieldAlert,
  Sparkles,
  Briefcase
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeNav: 'dashboard' | 'articles' | 'categories' | 'media' | 'expertise' | 'projects';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeNav }) => {
  const { navigate, route } = useRouter();
  const [user, setUser] = useState<AdminUser | null>(api.getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.checkAuth().then((auth) => {
      if (!mounted) return;
      if (!auth) {
        navigate('/admin/login');
      } else {
        setUser(auth);
      }
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    api.clearAuth();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7fafa] text-slate-500 font-mono text-xs">
        Authenticating admin session...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f7fafa] text-[#0f2d3a] flex flex-col font-sans selection:bg-teal-200/60">
      {/* Top Admin Navbar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3 flex items-center justify-between shadow-sm shadow-teal-900/5">
        <div className="flex items-center gap-6">
          <div
            onClick={() => navigate('/admin/dashboard')}
            className="cursor-pointer flex items-center gap-2 text-sm font-semibold tracking-tight text-[#0f2d3a] hover:text-teal-700 transition-colors"
          >
            <div className="w-6 h-6 rounded bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-mono text-xs font-bold">
              BM
            </div>
            <span>Content Studio</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-700">
              Admin
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-xs">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeNav === 'dashboard'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/admin/articles')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeNav === 'articles'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Articles
            </button>
            <button
              onClick={() => navigate('/admin/categories')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeNav === 'categories'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50/60'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              Topic Hubs
            </button>
            <button
              onClick={() => navigate('/admin/expertise')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeNav === 'expertise'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Expertise
            </button>
            <button
              onClick={() => navigate('/admin/projects')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeNav === 'projects'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Projects
            </button>
            <button
              onClick={() => navigate('/admin/media')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeNav === 'media'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50/60'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Media Library
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/articles/new')}
            className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm shadow-teal-700/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Article</span>
          </button>

          <button
            onClick={() => navigate('/insights')}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-teal-50 text-slate-600 hover:text-teal-700 text-xs border border-slate-200 hover:border-teal-300 transition-colors flex items-center gap-1.5"
            title="View Public Insights Library"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline">View Public Site</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden lg:inline font-mono">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};