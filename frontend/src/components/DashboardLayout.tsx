import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { Brain, BarChart3, Database, TrendingUp, FileText, Activity, Info, Settings, LogOut, Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

const notifications = [
  { id: 1, color: 'bg-primary', title: 'Pipeline completed', subtitle: 'EDA analysis finished', time: '2 mins ago' },
  { id: 2, color: 'bg-success', title: 'Dataset ready', subtitle: 'sales_2024.csv processed', time: '15 mins ago' },
  { id: 3, color: 'bg-blue-500', title: 'Model trained', subtitle: 'XGBoost 94.2% accuracy', time: '1 hour ago' },
];

const navItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  { icon: Database, label: 'Data Sources', path: '/dashboard/data-sources' },
  { icon: TrendingUp, label: 'Analysis', path: '/dashboard/analysis' },
  { icon: Brain, label: 'Predictions', path: '/dashboard/predictions' },
  { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
  { icon: Activity, label: 'Agent Monitor', path: '/dashboard/agent-monitoring' },
  { icon: Info, label: 'About', path: '/dashboard/about' },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar - GPU composited, reduced blur */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[260px] bg-white/[0.03] backdrop-blur-xl border-r border-white/[0.08] flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ willChange: 'transform', transform: sidebarOpen ? 'translateX(0) translateZ(0)' : undefined, WebkitTransform: 'translateZ(0)', transition: 'transform 0.3s ease' }}
      >
        <Link to="/dashboard" className="h-[72px] flex items-center gap-2 px-6 border-b border-white/[0.06] flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <span className="font-heading font-bold text-foreground">AutoInsight</span>
        </Link>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 ${active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-4 border-t border-white/[0.06] pt-4 space-y-3">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04]">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                {user?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name || 'Syed Kaifuddin'}</p>
              <p className="text-[11px] text-muted-foreground">Data Scientist</p>
            </div>
          </div>
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] w-full transition-colors">
            <Settings className="w-5 h-5" />Settings
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 w-full transition-colors">
            <LogOut className="w-5 h-5" />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - GPU composited, reduced blur */}
        <header
          className="h-[72px] flex items-center justify-between px-6 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl flex-shrink-0"
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        >
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-muted-foreground hover:text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search..." className="input-field pl-10 py-2 w-64 text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px]" style={{ zIndex: 9998 }} onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="fixed top-[72px] right-4 w-[360px] rounded-xl bg-card/95 backdrop-blur-xl overflow-hidden"
                      style={{ zIndex: 9999, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(139,92,246,0.2)' }}
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                        <h3 className="font-heading font-semibold text-sm text-foreground">Notifications</h3>
                        <button onClick={() => { setUnreadCount(0); }} className="text-xs text-primary hover:text-primary/80 transition-colors">Mark all read</button>
                      </div>
                      <div className="divide-y divide-white/[0.04]">
                        {notifications.map(n => (
                          <div key={n.id} className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] ${unreadCount > 0 ? 'bg-white/[0.02]' : ''}`}>
                            <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.color}`} />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground">{n.title}</p>
                              <p className="text-xs text-muted-foreground">{n.subtitle}</p>
                            </div>
                            <span className="text-[11px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2.5 border-t border-white/[0.06]">
                        <button className="text-xs text-primary hover:text-primary/80 transition-colors w-full text-center">View all notifications</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <Link to="/dashboard/account" className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary transition-opacity hover:opacity-80">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 relative">
          <div className="absolute inset-0 page-glow pointer-events-none" />
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
