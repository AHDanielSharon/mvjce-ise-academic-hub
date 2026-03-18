import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDatabaseReady } from '../config/db.js';
import { findOfflineUserById, toOfflineSafeUser } from '../config/offlineAuth.js';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');

    if (decoded.user) {
      req.user = decoded.user;
      return next();
    }

    if (!isDatabaseReady()) {
      const offlineUser = findOfflineUserById(decoded.id);
      if (!offlineUser) return res.status(401).json({ message: 'Unauthorized' });
      req.user = toOfflineSafeUser(offlineUser);
      return next();
    }

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
