import { ForecastData } from '../types/weather';
import { getWeatherIcon } from '../utils/iconMap';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface Props {
    data: ForecastData;
}

export const ForecastCard = ({ data }: Props) => {
    // Get one forecast per day (around noon)
    const dailyForecast = data.list.filter((item) => item.dt_txt.includes("12:00:00")).slice(0, 5);

    return (
        <div className="glass-panel p-6 md:p-8 animate-fade-in animation-delay-200">
            <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-blue-300" size={24} />
                <h3 className="text-2xl font-bold text-white tracking-tight">5-Day Forecast</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {dailyForecast.map((item, index) => (
                    <div
                        key={item.dt}
                        className="glass-card flex flex-col items-center justify-between py-6 gap-4 group hover:bg-white/10 transition-all duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <span className="text-lg font-medium text-blue-100/80">
                            {format(new Date(item.dt * 1000), 'EEE')}
                        </span>

                        <div className="scale-110 drop-shadow-lg group-hover:scale-125 transition-transform duration-300">
                            {getWeatherIcon(item.weather[0].id, true)}
                        </div>

                        <div className="text-center">
                            <span className="text-3xl font-bold block text-white tracking-tighter">
                                {Math.round(item.main.temp)}°
                            </span>
                            <span className="text-xs font-medium text-white/50 capitalize mt-1 block px-2 py-0.5 rounded-full bg-white/5">
                                {item.weather[0].main}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
