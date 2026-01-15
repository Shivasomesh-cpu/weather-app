import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Moon } from 'lucide-react';

export const getWeatherIcon = (id: number, isDay: boolean = true) => {
    // Thunderstorm
    if (id >= 200 && id < 300) return <CloudLightning size={48} className="text-yellow-400" />;
    // Drizzle
    if (id >= 300 && id < 400) return <CloudDrizzle size={48} className="text-blue-300" />;
    // Rain
    if (id >= 500 && id < 600) return <CloudRain size={48} className="text-blue-500" />;
    // Snow
    if (id >= 600 && id < 700) return <CloudSnow size={48} className="text-white" />;
    // Atmosphere (Fog, Mist, etc)
    if (id >= 700 && id < 800) return <CloudFog size={48} className="text-gray-300" />;
    // Clear
    if (id === 800) {
        return isDay ? <Sun size={48} className="text-orange-400" /> : <Moon size={48} className="text-slate-300" />;
    }
    // Clouds
    if (id > 800) return <Cloud size={48} className="text-gray-200" />;

    return <Sun size={48} className="text-orange-400" />;
};
