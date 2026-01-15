import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useUVIndex = (lat?: number, lon?: number) => {
    return useQuery({
        queryKey: ['uv', lat, lon],
        queryFn: async () => {
            if (!lat || !lon) return null;
            const { data } = await api.get('/weather/uv', { params: { lat, lon } });
            return data;
        },
        enabled: !!lat && !!lon,
    });
};
