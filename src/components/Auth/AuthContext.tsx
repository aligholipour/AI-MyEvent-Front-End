import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User } from '../../services/Auth/Auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login
    logout: () => void;
    getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // بررسی وضعیت لاگین در شروع برنامه
        const checkAuth = () => {
            const currentUser = authService.getUser();
            if (currentUser && authService.isAuthenticated()) {
                setUser(currentUser);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);
    
    const login = async (phoneNumber: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login({ phoneNumber });
            
            if (response.isExist)
                setUser(response.user);
            
            return response.isExist;
            
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const getAccessToken = () => authService.getAccessToken();

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                getAccessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}