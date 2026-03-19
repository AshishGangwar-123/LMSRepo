import { useEffect, useState } from 'react';
import AuthContext from './auth-context';

const STORAGE_KEY = 'nlm-user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        if (typeof window === 'undefined') {
            return null;
        }

        try {
            const savedUser = window.localStorage.getItem(STORAGE_KEY);
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const login = (userData) => {
        setUser({
            name: userData.name || 'Rajat',
            email: userData.email || 'rajat@college.edu',
            year: userData.year || '3rd Year',
            avatar: null,
            scores: {
                confidence: 76,
                communication: 72,
                professional: 81,
                employability: 78,
            },
        });
    };

    const logout = () => setUser(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (user) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            return;
        }

        window.localStorage.removeItem(STORAGE_KEY);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}
