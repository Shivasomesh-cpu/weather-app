import api from './api';
import { CurrentWeather, ForecastData, AirQualityData, GeocodingResult } from '../types/weather';

export const weatherApi = {
    getCurrentWeather: async (query: { city?: string; lat?: number; lon?: number }) => {
        const { data } = await api.get<CurrentWeather>('/weather/current', { params: query });
        return data;
    },

    getForecast: async (query: { city?: string; lat?: number; lon?: number }) => {
        const { data } = await api.get<ForecastData>('/weather/forecast', { params: query });
        return data;
    },

    getAirQuality: async (lat: number, lon: number) => {
        const { data } = await api.get<AirQualityData>('/weather/aqi', { params: { lat, lon } });
        return data;
    },

    geocodeCity: async (city: string) => {
        const { data } = await api.get<GeocodingResult[]>('/weather/geocode', { params: { city } });
        return data;
    },
};
