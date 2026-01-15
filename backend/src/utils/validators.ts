import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateCoordinates = (req: Request, res: Response, next: NextFunction) => {
    const { lat, lon } = req.query;

    if (lat && lon) {
        const latitude = parseFloat(lat as string);
        const longitude = parseFloat(lon as string);

        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            return next(new AppError('Invalid latitude. Must be between -90 and 90', 400));
        }

        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            return next(new AppError('Invalid longitude. Must be between -180 and 180', 400));
        }
    }

    next();
};

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
        return next(new AppError('Please provide a city name or coordinates (lat/lon)', 400));
    }

    next();
};
