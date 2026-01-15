import { CurrentWeather as CurrentWeatherType } from '../types/weather';
import { getWeatherIcon } from '../utils/iconMap';
import { Wind, Droplets, Eye, ThermometerSun, MapPin, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
    data: CurrentWeatherType;
}

export const CurrentWeather = ({ data }: Props) => {
    const isDay = data.weather[0].icon.includes('d');
    const today = format(new Date(), 'EEEE, d MMMM');

    return (
        <div className="glass-panel p-8 md:p-12 h-full flex flex-col justify-center relative overflow-hidden group">

            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none group-hover:bg-blue-400/20 transition-all duration-700" />

            <div className="z-10 relative">
                {/* Top Row: Location & Date */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <div className="flex items-center gap-2 text-blue-400/80 mb-3">
                            <MapPin size={18} />
                            <span className="font-bold tracking-widest uppercase text-xs">{data.sys.country} / WORLDWIDE</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
                            {data.name}
                        </h2>
                        <div className="flex items-center gap-2 text-white/40 mt-4 font-bold text-sm tracking-wide uppercase">
                            <CalendarDays size={16} className="text-blue-400/60 transition-transform group-hover:rotate-12" />
                            <span>{today}</span>
                        </div>
                    </div>
                    <div className="scale-[2] md:scale-[2.5] origin-top-right opacity-100 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-transform duration-700 group-hover:scale-[2.2] md:group-hover:scale-[2.7]">
                        {getWeatherIcon(data.weather[0].id, isDay)}
                    </div>
                </div>

                {/* Middle Row: Temperature & Description */}
                <div className="flex flex-col md:flex-row md:items-end gap-0 md:gap-8">
                    <span className="text-9xl md:text-[12rem] font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 tracking-tighter leading-none select-none">
                        {Math.round(data.main.temp)}°
                    </span>
                    <div className="flex flex-col gap-2 pb-4 md:pb-8">
                        <span className="text-3xl md:text-4xl font-bold text-blue-100/90 capitalize tracking-tight">
                            {data.weather[0].description}
                        </span>
                        <div className="flex items-center gap-4 text-white/40 font-bold text-sm tracking-wide">
                            <div className="flex items-center gap-1.5 ring-1 ring-white/10 px-3 py-1 rounded-full bg-white/5">
                                <span className="text-white/60">H:</span>
                                <span className="text-white">{Math.round(data.main.temp_max)}°</span>
                            </div>
                            <div className="flex items-center gap-1.5 ring-1 ring-white/10 px-3 py-1 rounded-full bg-white/5">
                                <span className="text-white/60">L:</span>
                                <span className="text-white">{Math.round(data.main.temp_min)}°</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtle Footer Details */}
                <div className="mt-12 flex gap-8 items-center border-t border-white/5 pt-8">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Humidity</span>
                        <span className="text-xl font-bold text-white/80">{data.main.humidity}%</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Feels Like</span>
                        <span className="text-xl font-bold text-white/80">{Math.round(data.main.feels_like)}°</span>
                    </div>
                    <div className="flex flex-col ml-auto text-right">
                        <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Visibility</span>
                        <span className="text-xl font-bold text-white/80">{(data.visibility / 1000).toFixed(1)} km</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1 hover:bg-white/10 transition-colors">
        <div className="text-blue-300 mb-1">{icon}</div>
        <span className="text-lg font-bold text-white">{value}</span>
        <span className="text-xs uppercase tracking-wider text-white/40 font-medium">{label}</span>
    </div>
);
