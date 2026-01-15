import { useQuery } from '@tanstack/react-query';
import { weatherApi } from '../services/weatherApi';

export const useWeather = (query: { city?: string; lat?: number; lon?: number }) => {
    return useQuery({
        queryKey: ['weather', query],
        queryFn: () => weatherApi.getCurrentWeather(query),
        enabled: !!query.city || (!!query.lat && !!query.lon),
        retry: 1,
    });
};
