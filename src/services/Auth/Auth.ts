import { dataURLtoFile } from "@/src/lib/utils";
import { RegisterResponse } from "@/src/types";
import { notifyAuthRequired } from "./authEvents";

export interface LoginRequest {
    phoneNumber: string
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    isExist: boolean;
    token: string;
    user?: {
        id: number;
        username: string;
        email: string;
        roles: string[];
    };
}

export interface User {
    id: number;
    username: string;
    roles: string[];
    profileAddress: string;
    phone: string;
}

class AuthService {
    private accessTokenKey = 'access_token';
    private refreshTokenKey = 'refresh_token';
    private userKey = 'user';
    private isLoggedInKey = 'is_logged_in';
    private baseUrl = process.env.API_BaseURL + '/User';
    private refreshTokenRequest: Promise<string | null> | null = null;

    private decodeJwtPayload(token: string): { exp?: number } | null {
        try {
            const payload = token.split('.')[1];
            if (!payload) return null;

            const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
            const paddedPayload = normalizedPayload.padEnd(
                normalizedPayload.length + ((4 - normalizedPayload.length % 4) % 4),
                '='
            );

            return JSON.parse(atob(paddedPayload));
        } catch {
            return null;
        }
    }

    private isTokenExpired(token: string, clockSkewSeconds = 30): boolean {
        const payload = this.decodeJwtPayload(token);
        if (!payload?.exp) return false;

        return payload.exp <= Math.floor(Date.now() / 1000) + clockSkewSeconds;
    }

    private requireLogin() {
        this.logout();
        notifyAuthRequired();
    }

    private hasStoredSession(): boolean {
        return Boolean(
            this.getAccessToken() ||
            this.getRefreshToken() ||
            this.getUser() ||
            localStorage.getItem(this.isLoggedInKey) === 'true'
        );
    }

    private extractTokens(data: any): { accessToken?: string; refreshToken?: string } {
        const tokenData = data?.data ?? data;

        return {
            accessToken: tokenData?.accessToken ?? tokenData?.AccessToken ?? tokenData?.token ?? tokenData?.Token,
            refreshToken: tokenData?.refreshToken ?? tokenData?.RefreshToken,
        };
    }

    private async requestRefreshToken(refreshToken: string): Promise<Response> {
        const endpoint = `${this.baseUrl}/refresh`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (response.status !== 404 && response.status !== 405) {
            return response;
        }

        return response as Response;
    }

    setTokens(accessToken: string, refreshToken: string) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        localStorage.setItem(this.isLoggedInKey, 'true');
    }

    getAccessToken(): string | null {
        return localStorage.getItem(this.accessTokenKey);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    setUser(user: User) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    getUser(): User | null {
        const userStr = localStorage.getItem(this.userKey);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr) as User;
        } catch {
            return null;
        }
    }

    isAuthenticated(): boolean {
        return !!this.getAccessToken() && localStorage.getItem(this.isLoggedInKey) === 'true';
    }

    async ensureValidAccessToken(): Promise<string | null> {
        const accessToken = this.getAccessToken();
        if (accessToken && !this.isTokenExpired(accessToken)) {
            return accessToken;
        }

        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            if (this.hasStoredSession()) {
                this.requireLogin();
            }
            return null;
        }

        return this.refreshToken();
    }

    // ذخیره کامل اطلاعات پس از لاگین موفق
    saveAuthData(accessToken: string, refreshToken: string, user: User) {
        this.setTokens(accessToken, refreshToken);
        this.setUser(user);
    }

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/SendOTPCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'خطا در ورود به سیستم');

        }
        const data: AuthResponse = await response.json();
        return data;
    }

    async refreshToken(): Promise<string | null> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            if (this.hasStoredSession()) {
                this.requireLogin();
            }
            return null;
        }

        if (this.refreshTokenRequest) {
            return this.refreshTokenRequest;
        }

        this.refreshTokenRequest = (async () => {
            const response = await this.requestRefreshToken(refreshToken);

            if (response.status === 401 || response.status === 403) {
                this.requireLogin();
                return null;
            }

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            const tokens = this.extractTokens(data);

            if (!tokens.accessToken) {
                this.requireLogin();
                return null;
            }

            this.setTokens(tokens.accessToken, tokens.refreshToken ?? refreshToken);
            return tokens.accessToken;
        })();

        try {
            return await this.refreshTokenRequest;
        } catch (error) {
            console.error('Refresh token failed:', error);
            return null;
        } finally {
            this.refreshTokenRequest = null;
        }
    }

    logout() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.isLoggedInKey);
    }

    async confirmCode(code: string, phoneNumber: string): Promise<{ success: boolean; user?: User; accessToken?: string; refreshToken?: string }> {
        const response = await fetch(`${this.baseUrl}/ConfirmCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, phoneNumber }),
        });

        if (response.status !== 200) {
            return { success: false };
        }

        const data = await response.json();
        return {
            success: true,
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        };
    }

    async resendOTPCode(phoneNumber: string): Promise<{ success: boolean, message: string }> {
        const response = await fetch(`${this.baseUrl}/ResendOTPCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber }),
        });

        if (response.status === 200) {
            return { success: true, message: '' };
        } else {
            const text = await response.text();
            return { success: false, message: text };
        }
    }

    async Register(registerData: any): Promise<{ registerData: RegisterResponse }> {
        try {
            const formData = new FormData();

            registerData.favouriteIds.forEach((favourite: number, index: number) => {
                formData.append(`FavouriteIds[${index}]`, favourite.toString());
            });

            formData.append('fullName', registerData.fullName || '');
            formData.append('gender', registerData.gender || 0);
            formData.append('maritalStatus', registerData.maritalStatus || 0);
            formData.append('cityId', registerData.cityId || registerData.cityId || 0);
            formData.append('jobId', String(registerData.jobId || registerData.jobId || 0));
            formData.append('phone', registerData.phone);

            if (registerData.birthDate) {
                const fromDateTime = new Date(registerData.birthDate);
                formData.append('birthDate', fromDateTime.toISOString());
            }

            if (registerData.profileImageAddress) {
                const imageFile = dataURLtoFile(registerData.profileImageAddress, 'event-image.jpg');
                formData.append('profileImageAddress', imageFile);
            }

            const response = await fetch(`${process.env.API_BaseURL}/User/Register`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return { registerData: result };
        }
        catch (err) {
            console.error('Failed to create event:', err);
            throw err;
        }
    }
}

export default new AuthService();
