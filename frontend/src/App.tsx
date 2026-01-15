import { Routes, Route } from 'react-router-dom';
import { WeatherDashboard } from './components/WeatherDashboard';

function App() {
    return (
        <div className="min-h-screen w-full bg-slate-950 overflow-x-hidden">
            <Routes>
                <Route path="/" element={<WeatherDashboard />} />
            </Routes>
        </div>
    )
}

export default App;
