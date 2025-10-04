import { Request, Response } from "express";
import { authService } from "./auth.service";

const loginWithCredential = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginWithCredential(req.body);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to login",
      error,
    });
  }
};

const authWithGoogle = async (req: Request, res: Response) => {
  try {
    const result = await authService.authWithGoogle(req.body);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login",
      error,
    });
  }
};

export const authController = {
  loginWithCredential,
  authWithGoogle,
};
