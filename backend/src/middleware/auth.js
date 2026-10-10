import authService from '../services/authService.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '토큰이 필요합니다.' });
  }

  const decoded = authService.verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
  }

  req.user = decoded;
  next();
};

export const errorHandler = (err, req, res, next) => {
  console.error('오류:', err);
  res.status(err.status || 500).json({
    error: err.message || '서버 오류가 발생했습니다.',
  });
};
