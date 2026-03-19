import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

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

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
