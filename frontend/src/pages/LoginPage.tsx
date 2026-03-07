import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Lock, Chrome, Github } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center relative overflow-hidden px-4">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-purple/8 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-bg-card border border-border rounded-2xl p-8">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold font-[family-name:var(--font-heading)]">AutoInsight</span>
                    </div>

                    <h1 className="text-2xl font-semibold font-[family-name:var(--font-heading)] text-center mb-2">Welcome back</h1>
                    <p className="text-text-muted text-sm text-center mb-8">Sign in to continue to your dashboard</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-text-secondary mb-1.5 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-bg-section border border-border rounded-[10px] py-3 pl-10 pr-4 text-white placeholder:text-text-muted focus:border-accent-purple focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary mb-1.5 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-bg-section border border-border rounded-[10px] py-3 pl-10 pr-4 text-white placeholder:text-text-muted focus:border-accent-purple focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3.5 bg-gradient-to-r from-accent-purple to-accent-indigo rounded-[10px] text-[15px] font-semibold hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all duration-300 mt-2"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <span className="flex-1 h-px bg-border" />
                        <span className="text-text-muted text-xs">or continue with</span>
                        <span className="flex-1 h-px bg-border" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-3 border border-border rounded-[10px] hover:border-accent-purple text-text-secondary hover:text-white transition-all duration-200 text-sm font-medium">
                            <Chrome className="w-4 h-4" /> Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 border border-border rounded-[10px] hover:border-accent-purple text-text-secondary hover:text-white transition-all duration-200 text-sm font-medium">
                            <Github className="w-4 h-4" /> GitHub
                        </button>
                    </div>

                    <p className="text-center text-sm text-text-muted mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-accent-purple hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
