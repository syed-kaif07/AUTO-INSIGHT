import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import {
    Brain, BarChart3, Database, TrendingUp, FileText, Activity, Info,
    Settings, LogOut, Search, Bell, Menu, X, ChevronLeft
} from 'lucide-react';

const sidebarLinks = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/dashboard/data-sources', icon: Database, label: 'Data Sources' },
    { to: '/dashboard/analysis', icon: TrendingUp, label: 'Analysis' },
    { to: '/dashboard/predictions', icon: Brain, label: 'Predictions' },
    { to: '/dashboard/reports', icon: FileText, label: 'Reports' },
    { to: '/dashboard/agent-monitoring', icon: Activity, label: 'Agent Monitor' },
    { to: '/dashboard/about', icon: Info, label: 'About' },
];

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => {
        if (path === '/dashboard') return location.pathname === '/dashboard';
        return location.pathname.startsWith(path);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-5 flex items-center gap-3 border-b border-border">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                </div>
                {sidebarOpen && <span className="text-lg font-bold font-[family-name:var(--font-heading)]">AutoInsight</span>}
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {sidebarLinks.map(({ to, icon: Icon, label }) => (
                    <Link
                        key={to}
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${isActive(to)
                                ? 'bg-accent-purple/15 text-accent-purple border border-accent-purple/20'
                                : 'text-text-muted hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Icon className="w-[18px] h-[18px] shrink-0" />
                        {sidebarOpen && <span>{label}</span>}
                    </Link>
                ))}
            </nav>

            <div className="p-3 space-y-1 border-t border-border">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-text-muted hover:text-white hover:bg-white/5 transition-all duration-200 w-full">
                    <Settings className="w-[18px] h-[18px] shrink-0" />
                    {sidebarOpen && <span>Settings</span>}
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-error hover:bg-error/10 transition-all duration-200 w-full"
                >
                    <LogOut className="w-[18px] h-[18px] shrink-0" />
                    {sidebarOpen && <span>Log Out</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-bg-primary overflow-hidden">
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col bg-bg-secondary border-r border-border transition-all duration-300 shrink-0 ${sidebarOpen ? 'w-[260px]' : 'w-[72px]'
                    }`}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-[260px] bg-bg-secondary border-r border-border">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-[72px] bg-bg-secondary/80 backdrop-blur-xl border-b border-border flex items-center px-6 gap-4 shrink-0">
                    <button
                        onClick={() => { if (window.innerWidth < 1024) setMobileOpen(!mobileOpen); else setSidebarOpen(!sidebarOpen); }}
                        className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors"
                    >
                        {sidebarOpen ? <ChevronLeft className="w-5 h-5 hidden lg:block" /> : <Menu className="w-5 h-5 hidden lg:block" />}
                        {mobileOpen ? <X className="w-5 h-5 lg:hidden" /> : <Menu className="w-5 h-5 lg:hidden" />}
                    </button>

                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-bg-section border border-border rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:border-accent-purple focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <button className="relative p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-purple" />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center text-sm font-semibold cursor-pointer">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
