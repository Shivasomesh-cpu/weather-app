import { useQuery } from '@tanstack/react-query';
import { weatherApi } from '../services/weatherApi';

export const useAirQuality = (lat?: number, lon?: number) => {
    return useQuery({
        queryKey: ['aqi', lat, lon],
        queryFn: () => weatherApi.getAirQuality(lat!, lon!),
        enabled: !!lat && !!lon,
    });
};
