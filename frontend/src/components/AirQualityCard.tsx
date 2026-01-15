import { AirQualityData } from '../types/weather';
import { Wind } from 'lucide-react';

interface Props {
    data: AirQualityData;
}

export const AirQualityCard = ({ data }: Props) => {
    const aqi = data.list[0].main.aqi;

    // Status Logic
    const getAQIStatus = (aqi: number) => {
        switch (aqi) {
            case 1: return { label: 'Good', color: 'text-green-400', barColor: 'bg-green-400', desc: 'Air quality is satisfactory.' };
            case 2: return { label: 'Fair', color: 'text-yellow-400', barColor: 'bg-yellow-400', desc: 'Air quality is acceptable.' };
            case 3: return { label: 'Moderate', color: 'text-orange-400', barColor: 'bg-orange-400', desc: 'Sensitive groups may be affected.' };
            case 4: return { label: 'Poor', color: 'text-red-400', barColor: 'bg-red-400', desc: 'Health effects possible.' };
            case 5: return { label: 'Very Poor', color: 'text-purple-400', barColor: 'bg-purple-400', desc: 'Health warnings needed.' };
            default: return { label: 'Unknown', color: 'text-gray-400', barColor: 'bg-gray-400', desc: 'No data available.' };
        }
    };
    const status = getAQIStatus(aqi);

    return (
        <div className="glass-panel p-6 flex flex-col h-full relative overflow-hidden group">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 z-10">
                <div className="flex items-center gap-2">
                    <Wind className="text-blue-300" size={20} />
                    <h3 className="text-blue-200 text-sm font-bold uppercase tracking-wider">Air Quality</h3>
                </div>
                <div className={`px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-bold uppercase ${status.color}`}>
                    {status.label}
                </div>
            </div>

            {/* Main AQI Display */}
            <div className="flex-1 flex flex-col items-center justify-center z-10">
                <div className="relative mb-2">
                    <div className="text-6xl font-black text-white tracking-tighter">{aqi}</div>
                    <div className="text-xs uppercase font-medium text-white/40 text-center tracking-widest mt-1">Index</div>
                </div>

                {/* Visual Bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <div className={`h-full ${status.barColor} transition-all duration-1000`} style={{ width: `${(aqi / 5) * 100}%` }} />
                </div>
                <p className="text-xs text-center text-white/50 mt-3 font-medium">{status.desc}</p>
            </div>

            {/* Pollutants Grid */}
            <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-white/5">
                <Pollutant label="PM2.5" value={data.list[0].components.pm2_5} />
                <Pollutant label="NO2" value={data.list[0].components.no2} />
                <Pollutant label="O3" value={data.list[0].components.o3} />
                <Pollutant label="SO2" value={data.list[0].components.so2} />
            </div>
        </div>
    );
};

const Pollutant = ({ label, value }: { label: string, value: number }) => (
    <div className="text-center">
        <div className="text-[10px] uppercase font-bold text-white/30 tracking-wider mb-1">{label}</div>
        <div className="text-sm font-semibold text-white">{value.toFixed(0)}</div>
    </div>
);
