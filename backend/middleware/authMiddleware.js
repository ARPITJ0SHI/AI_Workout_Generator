const jwt = require('jsonwebtoken');
const User = require('../model/user.js');

const authMiddleware = async (req, res, next) => {
  console.log('Headers received:', req.headers); // Log all headers

  const authHeader = req.header('Authorization');
  console.log('Authorization header:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ msg: 'No Authorization header, authorization denied' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  console.log('Extracted token:', token);

  if (!token) {
    return res.status(401).json({ msg: 'No token found in Authorization header' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    if (!decoded.user || !decoded.user.id) {
      return res.status(401).json({ msg: 'Invalid token structure' });
    }

    const user = await User.findById(decoded.user.id);
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ msg: 'Token expired' });
    }
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;