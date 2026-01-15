import { Sun } from 'lucide-react';

interface Props {
    uv: number;
}

export const UVIndexCard = ({ uv }: Props) => {
    // Calculate percentage for progress bar (max UV usually around 11)
    const percentage = Math.min((uv / 11) * 100, 100);

    const getUVLabel = (uv: number) => {
        if (uv <= 2) return 'Low';
        if (uv <= 5) return 'Moderate';
        if (uv <= 7) return 'High';
        if (uv <= 10) return 'Very High';
        return 'Extreme';
    };

    return (
        <div className="glass-panel p-6 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-50">
                <Sun className="text-yellow-400 group-hover:rotate-45 transition-transform duration-700" size={32} />
            </div>

            <div>
                <h3 className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-1">UV Index</h3>
                <div className="text-4xl font-bold text-white mb-1">{uv.toFixed(1)}</div>
                <div className="text-lg font-medium text-white/80">{getUVLabel(uv)}</div>
            </div>

            <div className="mt-6">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="text-xs text-white/40 mt-3 font-medium leading-relaxed">
                    Use sun protection until 16:00 to avoid sunburn.
                </p>
            </div>
        </div>
    );
};
