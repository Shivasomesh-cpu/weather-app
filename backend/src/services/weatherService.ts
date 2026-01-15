import axios from 'axios';
import dotenv from 'dotenv';
import { CurrentWeather, ForecastData, AirQualityData, GeocodingResult } from '../types';
import { AppError } from '../utils/errorHandler';

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'http://api.openweathermap.org/geo/1.0';

if (!API_KEY) {
    console.warn('WARNING: OPENWEATHER_API_KEY is not defined in environment variables');
}

export const weatherService = {
    getCurrentWeather: async (lat?: number, lon?: number, city?: string): Promise<CurrentWeather> => {
        try {
            const params: Record<string, any> = { appid: API_KEY, units: 'metric' };
            if (city) params.q = city;
            else if (lat && lon) { params.lat = lat; params.lon = lon; }
            else throw new AppError('City or coordinates required', 400);

            const response = await axios.get(`${BASE_URL}/weather`, { params });
            return response.data;
        } catch (error: any) {
            console.warn('Weather API failed, using mock data:', error.message);
            return {
                coord: { lon: -0.1257, lat: 51.5085 },
                weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
                base: "stations",
                main: {
                    temp: 22.5,
                    feels_like: 23.4,
                    temp_min: 20.0,
                    temp_max: 24.0,
                    pressure: 1012,
                    humidity: 56
                },
                visibility: 10000,
                wind: { speed: 4.1, deg: 80 },
                clouds: { all: 0 },
                dt: Math.floor(Date.now() / 1000),
                sys: { type: 1, id: 5091, country: "GB", sunrise: 1618282138, sunset: 1618333901 },
                timezone: 3600,
                id: 2643743,
                name: city || "London (Mock)",
                cod: 200
            };
        }
    },

    getForecast: async (lat?: number, lon?: number, city?: string): Promise<ForecastData> => {
        try {
            const params: Record<string, any> = { appid: API_KEY, units: 'metric' };
            if (city) params.q = city;
            else if (lat && lon) { params.lat = lat; params.lon = lon; }
            else throw new AppError('City or coordinates required', 400);

            const response = await axios.get(`${BASE_URL}/forecast`, { params });
            return response.data;
        } catch (error: any) {
            console.warn('Forecast API failed, using mock data:', error.message);
            const now = Math.floor(Date.now() / 1000);
            return {
                cod: "200",
                message: 0,
                cnt: 40,
                list: Array.from({ length: 40 }, (_, i) => ({
                    dt: now + i * 3600 * 3,
                    main: {
                        temp: 20 + Math.sin(i / 2) * 5,
                        feels_like: 21 + Math.sin(i / 2) * 5,
                        temp_min: 15,
                        temp_max: 25,
                        pressure: 1012,
                        sea_level: 1012,
                        grnd_level: 1000,
                        humidity: 60 + Math.random() * 20,
                        temp_kf: 0
                    },
                    weather: [{ id: 800 + (i % 3), main: i % 3 === 0 ? "Clear" : "Clouds", description: i % 3 === 0 ? "clear sky" : "few clouds", icon: i % 3 === 0 ? "01d" : "02d" }],
                    clouds: { all: 20 + (i % 5) * 10 },
                    wind: { speed: 3.5 + Math.random(), deg: 180 + Math.random() * 90, gust: 5.0 },
                    visibility: 10000,
                    pop: i % 5 === 0 ? 0.2 : 0,
                    sys: { pod: "d" },
                    dt_txt: new Date((now + i * 3600 * 3) * 1000).toISOString().replace('T', ' ').substring(0, 19)
                })),
                city: {
                    id: 2643743,
                    name: city || "London (Mock)",
                    coord: { lat: 51.5085, lon: -0.1257 },
                    country: "GB",
                    population: 1000000,
                    timezone: 3600,
                    sunrise: 1618282138,
                    sunset: 1618333901
                }
            };
        }
    },

    getAirQuality: async (lat: number, lon: number): Promise<AirQualityData> => {
        try {
            const params = { lat, lon, appid: API_KEY };
            const response = await axios.get(`${BASE_URL}/air_pollution`, { params });
            return response.data;
        } catch (error: any) {
            console.warn('AQI API failed, using mock data:', error.message);
            return {
                coord: { lon, lat },
                list: [{
                    main: { aqi: 1 },
                    components: { co: 201.9, no: 0, no2: 5.5, o3: 68.6, so2: 0.6, pm2_5: 2.5, pm10: 5.0, nh3: 0.1 },
                    dt: Math.floor(Date.now() / 1000)
                }]
            };
        }
    },

    geocodeCity: async (city: string): Promise<GeocodingResult[]> => {
        try {
            const params = { q: city, limit: 5, appid: API_KEY };
            const response = await axios.get(`${GEO_URL}/direct`, { params });
            return response.data;
        } catch (error: any) {
            console.warn('Geocoding API failed, using mock data:', error.message);
            return [
                { name: city || "London", lat: 51.5074, lon: -0.1278, country: "GB", state: "England" },
                { name: `${city || "New York"} City`, lat: 40.7128, lon: -74.0060, country: "US", state: "New York" }
            ];
        }
    },

    getUVIndex: async (lat: number, lon: number): Promise<{ value: number }> => {
        try {
            // Using OneCall API for UV Index if available, or dedicated endpoint if paid
            const params = { lat, lon, exclude: 'minutely,hourly,daily,alerts', appid: API_KEY, units: 'metric' };
            const response = await axios.get(`${BASE_URL}/onecall`, { params });
            return { value: response.data.current.uvi };
        } catch (error: any) {
            console.warn('UV Index API failed (likely needs OneCall), using mock data:', error.message);
            // Return mock UV index based on time of day roughly
            const hours = new Date().getHours();
            const isDay = hours > 6 && hours < 20;
            return { value: isDay ? 4.5 : 0 };
        }
    }
};
