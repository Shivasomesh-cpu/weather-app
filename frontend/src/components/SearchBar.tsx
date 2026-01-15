import { useState, useEffect, useRef } from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { weatherApi } from '../services/weatherApi';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { GeocodingResult } from '../types/weather';

export const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<GeocodingResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { setSelectedLocation } = useWeatherStore();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                setIsLoading(true);
                try {
                    const data = await weatherApi.geocodeCity(query);
                    setResults(data);
                } catch (error) {
                    console.error('Search error', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setResults([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (location: GeocodingResult) => {
        setSelectedLocation(location);
        setQuery('');
        setResults([]);
    };

    return (
        <div ref={wrapperRef} className="relative w-full z-50">
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search city..."
                    className="w-full h-12 bg-white/10 border border-white/10 rounded-full pl-12 pr-4 text-white placeholder-blue-200/50 backdrop-blur-md focus:bg-white/15 focus:border-white/30 focus:outline-none transition-all shadow-lg"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200/70">
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                </div>
            </div>

            {/* Results Dropdown */}
            {results.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-3 bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {results.map((result, index) => (
                            <div
                                key={`${result.lat}-${result.lon}-${index}`}
                                onClick={() => handleSelect(result)}
                                className="px-5 py-4 hover:bg-white/5 cursor-pointer transition-colors flex items-center gap-3 border-b border-white/5 last:border-none"
                            >
                                <MapPin size={16} className="text-blue-400 shrink-0" />
                                <div>
                                    <div className="font-semibold text-white text-sm">{result.name}</div>
                                    <div className="text-xs text-blue-200/60 font-medium">
                                        {result.state ? `${result.state}, ` : ''}{result.country}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
