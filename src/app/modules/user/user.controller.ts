import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getUserById(Number(id));
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.updateUser(Number(id), req.body);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(Number(id));
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userController = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
