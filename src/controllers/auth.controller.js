import { StatusCodes } from 'http-status-codes';
import { loginService } from '../services/auth.service.js';

export const login = async (req, res) => {
  try {
    const data = await loginService(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      data,
    });

  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};
