import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, name?: string) => void;
    signup: (name: string, email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('autoinsight_user');
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('autoinsight_user'); }
        }
    }, []);

    const login = (email: string, _password: string, name?: string) => {
        const u: User = { name: name || email.split('@')[0], email };
        localStorage.setItem('autoinsight_user', JSON.stringify(u));
        setUser(u);
    };

    const signup = (name: string, email: string, _password: string) => {
        const u: User = { name, email };
        localStorage.setItem('autoinsight_user', JSON.stringify(u));
        setUser(u);
    };

    const logout = () => {
        localStorage.removeItem('autoinsight_user');
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
