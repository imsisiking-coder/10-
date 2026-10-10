import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

class AuthService {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(userId, email) {
    return jwt.sign(
      { userId, email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: process.env.JWT_EXPIRATION || '15m' }
    );
  }

  generateRefreshToken(userId, email) {
    return jwt.sign(
      { userId, email },
      process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your_refresh_secret');
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();
