const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded; // { id, role }

    next();

  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };