import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, AuthResponse } from '../../services/Auth/Auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isLoggedIn: boolean;
    login: (phoneNumber: string) => Promise<{ success: boolean; user?: User; needRegister?: boolean }>;
    confirmLogin: (code: string, phoneNumber: string) => Promise<{ success: boolean; user?: User; needRegister?: boolean }>;
    logout: () => void;
    getAccessToken: () => string | null;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // بررسی وضعیت لاگین در شروع برنامه - بازیابی از localStorage
    useEffect(() => {
        const checkAuth = () => {
            const currentUser = authService.getUser();
            const isAuth = authService.isAuthenticated();
            
            if (currentUser && isAuth) {
                setUser(currentUser);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // مرحله اول: درخواست کد OTP
    const login = async (phoneNumber: string): Promise<{ success: boolean; user?: User; needRegister?: boolean }> => {
        setIsLoading(true);
        try {
            const response = await authService.login({ phoneNumber });
            
            if (response.isExist && response.user) {
                // کاربر وجود دارد - منتظر تایید کد هستیم
                return {
                    success: true,
                    user: {
                        id: response.user.id,
                        profileAddress: "",
                        roles: response.user.roles || [],
                        username: response.user.username
                    },
                    needRegister: false
                };
            } else {
                // کاربر وجود ندارد - نیاز به ثبت‌نام
                return {
                    success: true,
                    needRegister: true
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    // مرحله دوم: تایید کد OTP و تکمیل لاگین
    const confirmLogin = async (code: string, phoneNumber: string): Promise<{ success: boolean; user?: User; needRegister?: boolean }> => {
        setIsLoading(true);
        try {
            const result = await authService.confirmCode(code, phoneNumber);
            
            if (result.success && result.user && result.accessToken) {
                const newUser: User = {
                    id: result.user.id,
                    profileAddress: result.user.profileAddress || "",
                    roles: result.user.roles || [],
                    username: result.user.username
                };
                
                // ذخیره اطلاعات در localStorage
                authService.saveAuthData(result.accessToken, result.refreshToken || '', newUser);
                setUser(newUser);
                setIsLoggedIn(true);
                
                return {
                    success: true,
                    user: newUser,
                    needRegister: false
                };
            }
            
            return { success: false };
        } catch (error) {
            console.error('Confirm code error:', error);
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsLoggedIn(false);
    };

    const getAccessToken = () => authService.getAccessToken();

    const updateUser = (updatedUser: User) => {
        authService.setUser(updatedUser);
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user && isLoggedIn,
                isLoading,
                isLoggedIn,
                login,
                confirmLogin,
                logout,
                getAccessToken,
                updateUser,
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