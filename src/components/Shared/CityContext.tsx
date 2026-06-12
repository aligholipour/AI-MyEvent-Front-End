// src/contexts/CityContext.tsx - نسخه اصلاح شده کامل
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { getUserCity } from '../../services/locations';

interface CityContextType {
    selectedCity: string;
    selectedCityId: number | null;
    setSelectedCity: (cityName: string, cityId: number) => void;
    isLoading: boolean;
    updateUserCityPreference: (cityId: number, cityName: string) => Promise<void>;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

const STORAGE_KEY = 'user_selected_city';
const STORAGE_CITY_ID_KEY = 'user_selected_city_id';
// const DEFAULT_CITY = 'تهران';
// const DEFAULT_CITY_ID = 1;

export const CityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState<string>('---');
    const [selectedCityId, setSelectedCityId] = useState<number | null>(0);
    const [isLoading, setIsLoading] = useState(true);
    const { isLoggedIn } = useAuth();

    const initialLoadDone = useRef(false);
    const isMounted = useRef(true);

    const handleSetSelectedCity = useCallback((cityName: string, cityId: number) => {
        setSelectedCity(cityName);
        setSelectedCityId(cityId);

        try {
            localStorage.setItem(STORAGE_KEY, cityName);
            localStorage.setItem(STORAGE_CITY_ID_KEY, cityId.toString());
        } catch (error) {
            console.error('Error saving city to localStorage:', error);
        }
    }, []);

    const loadFromLocalStorage = useCallback(() => {
        const storedCity = localStorage.getItem(STORAGE_KEY);
        const storedCityId = localStorage.getItem(STORAGE_CITY_ID_KEY);

        if (storedCity && storedCityId) {
            setSelectedCity(storedCity);
            setSelectedCityId(parseInt(storedCityId, 10));
            return true;
        }
        return false;
    }, []);

    useEffect(() => {
        if (initialLoadDone.current) {
            return;
        }

        const loadCity = async () => {
            setIsLoading(true);

            const hasLocalData = loadFromLocalStorage();

            try {
                const userCity = await getUserCity();
                if (userCity && userCity.cityId && userCity.cityName) {
                    // اگر اطلاعات سرور با localStorage متفاوت است، به‌روزرسانی کن
                    const storedCityId = localStorage.getItem(STORAGE_CITY_ID_KEY);
                    if (userCity.cityId !== parseInt(storedCityId || '0', 10)) {
                        handleSetSelectedCity(userCity.cityName, userCity.cityId);
                    }
                }
            } catch (error) {
                console.error('Error loading city from server:', error);
            }

            if (isMounted.current) {
                setIsLoading(false);
                initialLoadDone.current = true;
            }
        };

        loadCity();

        // Cleanup
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (!initialLoadDone.current || !isLoggedIn) {
            return;
        }

        const syncWithServer = async () => {
            try {
                const userCity = await getUserCity();
                if (userCity && userCity.cityId && userCity.cityName) {
                    const storedCityId = localStorage.getItem(STORAGE_CITY_ID_KEY);
                    if (userCity.cityId !== parseInt(storedCityId || '0', 10)) {
                        handleSetSelectedCity(userCity.cityName, userCity.cityId);
                    }
                }
            } catch (error) {
                console.error('Error syncing city with server:', error);
            }
        };

        syncWithServer();
    }, [isLoggedIn, handleSetSelectedCity]); 

    const updateUserCityPreference = async (cityId: number, cityName: string) => {
        handleSetSelectedCity(cityName, cityId);
    };

    return (
        <CityContext.Provider
            value={{
                selectedCity,
                selectedCityId,
                setSelectedCity: handleSetSelectedCity,
                isLoading,
                updateUserCityPreference
            }}>
            {children}
        </CityContext.Provider>
    );
};

export const useCity = () => {
    const context = useContext(CityContext);
    if (context === undefined) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
};