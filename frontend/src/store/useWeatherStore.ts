import { create } from 'zustand';
import { GeocodingResult } from '../types/weather';

interface WeatherState {
    searchQuery: string;
    selectedLocation: GeocodingResult | null;
    recentLocations: GeocodingResult[];
    units: 'metric' | 'imperial';
    setSearchQuery: (query: string) => void;
    setSelectedLocation: (location: GeocodingResult) => void;
    addRecentLocation: (location: GeocodingResult) => void;
    toggleUnits: () => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
    searchQuery: '',
    selectedLocation: null,
    recentLocations: [],
    units: 'metric',
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedLocation: (location) => set((state) => {
        // Add to recent locations if not already there
        const exists = state.recentLocations.some(
            (loc) => loc.lat === location.lat && loc.lon === location.lon
        );
        const recent = exists
            ? state.recentLocations
            : [location, ...state.recentLocations].slice(0, 5);

        return { selectedLocation: location, recentLocations: recent };
    }),
    addRecentLocation: (location) => set((state) => {
        const exists = state.recentLocations.some(
            (loc) => loc.lat === location.lat && loc.lon === location.lon
        );
        return exists ? state : { recentLocations: [location, ...state.recentLocations].slice(0, 5) };
    }),
    toggleUnits: () => set((state) => ({ units: state.units === 'metric' ? 'imperial' : 'metric' })),
}));
