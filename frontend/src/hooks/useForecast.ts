import { useQuery } from '@tanstack/react-query';
import { weatherApi } from '../services/weatherApi';

export const useForecast = (query: { city?: string; lat?: number; lon?: number }) => {
    return useQuery({
        queryKey: ['forecast', query],
        queryFn: () => weatherApi.getForecast(query),
        enabled: !!query.city || (!!query.lat && !!query.lon),
        retry: 1,
    });
};
