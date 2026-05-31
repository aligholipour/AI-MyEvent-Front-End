export interface LoginRequest {
    // username: string;
    // password: string;
    phoneNumber: string
}
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    isExist: boolean
    user: {
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
    profileAddress: string
}

class AuthService {
    private accessTokenKey = 'access_token';
    private refreshTokenKey = 'refresh_token';
    private userKey = 'user';
    private baseUrl = 'http://localhost:5066/api/User';

    setTokens(accessToken: string, refreshToken: string) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
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
        return !!this.getAccessToken();
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

        if (data.isExist) {
            this.setTokens(data.accessToken, data.refreshToken);
            this.setUser(data.user);
        }

        return data;
    }

    async refreshToken(): Promise<string | null> {

        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return null;

        try {
            const response = await fetch(`${this.baseUrl}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                this.logout();
                return null;
            }

            const data = await response.json();
            this.setTokens(data.accessToken, data.refreshToken);
            return data.accessToken;
        } catch (error) {
            console.error('Refresh token failed:', error);
            this.logout();
            return null;
        }
    }

    logout() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);
        window.location.href = '/login';
    }
}

export default new AuthService();
