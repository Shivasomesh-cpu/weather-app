import { Router } from 'express';
import { weatherService } from '../services/weatherService';
import { cacheService } from '../services/cacheService';
import { validateRequest, validateCoordinates } from '../utils/validators';
import { AppError } from '../utils/errorHandler';

const router = Router();

router.get('/current', validateRequest, validateCoordinates, async (req, res, next) => {
    try {
        const { city, lat, lon } = req.query;
        const cacheKey = cacheService.generateKey('current', req.query as Record<string, any>);
        const cachedData = cacheService.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const data = await weatherService.getCurrentWeather(
            lat ? parseFloat(lat as string) : undefined,
            lon ? parseFloat(lon as string) : undefined,
            city as string
        );

        cacheService.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get('/forecast', validateRequest, validateCoordinates, async (req, res, next) => {
    try {
        const { city, lat, lon } = req.query;
        const cacheKey = cacheService.generateKey('forecast', req.query as Record<string, any>);
        const cachedData = cacheService.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const data = await weatherService.getForecast(
            lat ? parseFloat(lat as string) : undefined,
            lon ? parseFloat(lon as string) : undefined,
            city as string
        );

        cacheService.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get('/aqi', validateCoordinates, async (req, res, next) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) return next(new AppError('Coordinates required for AQI', 400));

        const cacheKey = cacheService.generateKey('aqi', req.query as Record<string, any>);
        const cachedData = cacheService.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const data = await weatherService.getAirQuality(
            parseFloat(lat as string),
            parseFloat(lon as string)
        );

        cacheService.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get('/uv', validateCoordinates, async (req, res, next) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) return next(new AppError('Coordinates required for UV', 400));

        const cacheKey = cacheService.generateKey('uv', req.query as Record<string, any>);
        const cachedData = cacheService.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const data = await weatherService.getUVIndex(
            parseFloat(lat as string),
            parseFloat(lon as string)
        );

        cacheService.set(cacheKey, data, 1800); // 30 min cache for UV
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get('/geocode', async (req, res, next) => {
    try {
        const { city } = req.query;
        if (!city) return next(new AppError('City name required', 400));

        const cacheKey = `geo:${city}`;
        const cachedData = cacheService.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const data = await weatherService.geocodeCity(city as string);
        cacheService.set(cacheKey, data, 3600 * 24); // Cache geocoding for 24h
        res.json(data);
    } catch (error) {
        next(error);
    }
});

export default router;
