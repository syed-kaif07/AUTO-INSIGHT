import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Features', href: '#features' },
        { label: 'Benefits', href: '#benefits' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
    ];

    const handleNavClick = (href: string) => {
        setIsOpen(false);
        if (location.pathname === '/') {
            const el = document.querySelector(href);
            el?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center bg-[rgba(11,11,26,0.8)] backdrop-blur-xl transition-all duration-300 ${scrolled ? 'border-b border-border' : ''
                }`}
        >
            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-shadow duration-300">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold font-[family-name:var(--font-heading)]">AutoInsight</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                            className="text-text-muted hover:text-white transition-colors duration-200 text-[15px]"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <Link
                        to="/login"
                        className="px-5 py-2.5 text-[15px] font-semibold text-text-secondary hover:text-white transition-colors duration-200"
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="px-6 py-2.5 text-[15px] font-semibold bg-gradient-to-r from-accent-purple to-accent-indigo rounded-[10px] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all duration-300"
                    >
                        Get Started
                    </Link>
                </div>

                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-[72px] left-0 right-0 bg-bg-secondary/95 backdrop-blur-xl border-b border-border md:hidden">
                    <div className="p-6 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                                className="text-text-muted hover:text-white transition-colors text-[15px] py-2"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="flex flex-col gap-3 pt-4 border-t border-border">
                            <Link to="/login" className="text-center py-2.5 text-text-secondary hover:text-white">Login</Link>
                            <Link to="/signup" className="text-center py-2.5 bg-gradient-to-r from-accent-purple to-accent-indigo rounded-[10px]">Get Started</Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
