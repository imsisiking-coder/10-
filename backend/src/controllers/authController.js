import User from '../models/User.js';
import authService from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // 이미 존재하는 사용자 확인
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: '이미 등록된 이메일입니다.' });
    }

    // 비밀번호 해싱
    const password_hash = await authService.hashPassword(password);

    // 사용자 생성
    const user = await User.create({
      email,
      password_hash,
      username,
    });

    // 토큰 생성
    const accessToken = authService.generateAccessToken(user.id, user.email);
    const refreshToken = authService.generateRefreshToken(user.id, user.email);

    res.status(201).json({
      message: '회원가입 성공',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // 비밀번호 확인
    const isValid = await authService.comparePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // 토큰 생성
    const accessToken = authService.generateAccessToken(user.id, user.email);
    const refreshToken = authService.generateRefreshToken(user.id, user.email);

    res.status(200).json({
      message: '로그인 성공',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: '리프레시 토큰이 필요합니다.' });
    }

    const decoded = authService.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: '유효하지 않은 리프레시 토큰입니다.' });
    }

    // 새 토큰 생성
    const newAccessToken = authService.generateAccessToken(decoded.userId, decoded.email);
    const newRefreshToken = authService.generateRefreshToken(decoded.userId, decoded.email);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    res.status(500).json({ error: '토큰 갱신 중 오류가 발생했습니다.' });
  }
};
