import { useEffect, useState } from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { useWeather } from '../hooks/useWeather';
import { useForecast } from '../hooks/useForecast';
import { useUVIndex } from '../hooks/useUVIndex';
import { SearchBar } from './SearchBar';
import { CurrentWeather } from './CurrentWeather';
import { ForecastCard } from './ForecastCard';
import { UVIndexCard } from './UVIndexCard';
import { LoadingSpinner } from './LoadingSpinner';
import { Wind, Gauge, Droplets } from 'lucide-react';

export const WeatherDashboard = () => {
    const { selectedLocation, setSelectedLocation } = useWeatherStore();
    const [theme, setTheme] = useState('clear');

    // Default to London on load
    useEffect(() => {
        if (!selectedLocation) {
            setSelectedLocation({ name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 });
        }
    }, [selectedLocation, setSelectedLocation]);

    const query = selectedLocation ? { lat: selectedLocation.lat, lon: selectedLocation.lon } : {};

    // Data Fetching
    const { data: weather, isLoading: loadW, error } = useWeather(query);
    const { data: forecast, isLoading: loadF } = useForecast(query);
    const { data: uv, isLoading: loadU } = useUVIndex(selectedLocation?.lat, selectedLocation?.lon);

    const isLoading = loadW || loadF || loadU;

    useEffect(() => {
        if (weather) {
            const main = weather.weather[0].main.toLowerCase();
            if (main.includes('cloud')) setTheme('clouds');
            else if (main.includes('rain') || main.includes('drizzle')) setTheme('rain');
            else if (main.includes('snow')) setTheme('snow');
            else setTheme('clear');
        }
    }, [weather]);

    return (
        <div className={`w-full max-w-7xl mx-auto space-y-8 animate-fade-in theme-${theme} p-4 md:p-8`}>
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <div className="text-center lg:text-left">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                        Weather Maxx
                    </h1>
                    <p className="text-blue-200/40 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">
                        Premium Weather Intelligence
                    </p>
                </div>
                <div className="w-full lg:max-w-md">
                    <SearchBar />
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="glass-panel p-6 border-red-500/30 bg-red-500/10 text-red-100 flex items-center justify-center rounded-2xl">
                    <span className="font-semibold">Unable to load weather data. Please check your connection.</span>
                </div>
            )}

            {/* Loading State */}
            {isLoading && !error && (
                <div className="flex justify-center py-20">
                    <LoadingSpinner />
                </div>
            )}

            {/* Main Content Grid */}
            {!isLoading && !error && weather && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Weather Card */}
                    <div className="lg:col-span-8 h-full">
                        <CurrentWeather data={weather} />
                    </div>

                    {/* Side Intelligence Panel */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {uv && <UVIndexCard uv={uv.value} />}

                        <div className="grid grid-cols-1 gap-4">
                            <StatsWidget
                                icon={<Wind className="text-blue-400" size={20} />}
                                label="Wind Dynamics"
                                value={`${Math.round(weather.wind.speed)} m/s`}
                                subValue="Atmospheric Flow"
                            />
                            <StatsWidget
                                icon={<Gauge className="text-blue-400" size={20} />}
                                label="Pressure"
                                value={`${weather.main.pressure} hPa`}
                                subValue="Barometric"
                            />
                            <StatsWidget
                                icon={<Droplets className="text-blue-400" size={20} />}
                                label="Humidity"
                                value={`${weather.main.humidity}%`}
                                subValue="Vapor Density"
                            />
                        </div>
                    </div>

                    {/* Forecast Section */}
                    <div className="lg:col-span-12">
                        {forecast && <ForecastCard data={forecast} />}
                    </div>
                </div>
            )}
        </div>
    );
};

const StatsWidget = ({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue?: string }) => (
    <div className="glass-panel p-6 flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    {icon}
                </div>
                <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">{label}</span>
            </div>
            {subValue && <span className="text-[10px] font-bold text-blue-400/60 uppercase">{subValue}</span>}
        </div>
        <div className="text-3xl font-black text-white tracking-tight">{value}</div>
    </div>
);
