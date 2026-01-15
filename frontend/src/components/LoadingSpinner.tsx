import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => {
    return (
        <div className="flex flex-col justify-center items-center h-[50vh] w-full gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                <Loader2 className="animate-spin text-blue-400 relative z-10" size={64} strokeWidth={1} />
            </div>
            <p className="text-blue-200/40 font-medium tracking-widest text-xs uppercase animate-pulse">
                Fetching intelligence...
            </p>
        </div>
    );
};
