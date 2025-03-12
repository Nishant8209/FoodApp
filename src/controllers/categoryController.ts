import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as categoryService from '../services/categoryService';
import { failResponse, successResponse, errorResponse } from '../utils/response';
import { StatusCode } from '../utils/StatusCodes';
import { Messages } from '../utils/Constants';

export const createCategories = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    failResponse(res, errors.array(), StatusCode.Bad_Request);
    return;
  }
  try {
    const categories = req.body;
    if (!Array.isArray(categories)) {
      failResponse(res, 'Request body must be an array of categories.', StatusCode.Bad_Request);
      return;
    }
    // Insert categories in bulk
    const createdCategories = await categoryService.createCategory(categories);
    successResponse(res, createdCategories, Messages.Success, StatusCode.Created);
    return;
  } catch (error) {
    errorResponse(res, (error as Error).message);
    return;
  }
};

export const getAllCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryService.getAllCategories();
    successResponse(res, categories);
    return;
  } catch (error) {
    errorResponse(res, (error as Error).message);
    return; 
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      failResponse(res, Messages.Category_Not_Found, StatusCode.Not_Found);
      return;
    }
    successResponse(res, category);
    return 
  } catch (error) {
    errorResponse(res, (error as Error).message);
    return;
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    failResponse(res, errors.array(), StatusCode.Bad_Request);
    return;
  }
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    if (!category) {
      failResponse(res, Messages.Category_Not_Found, StatusCode.Not_Found);
      return;
    }
    successResponse(res, category);
    return;
  } catch (error) {
    errorResponse(res, (error as Error).message);
    return;
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    if (!category) {
      failResponse(res, Messages.Category_Not_Found, StatusCode.Not_Found);
      return;
    }
    successResponse(res, null, Messages.Category_Deleted_Successfully , StatusCode.No_Content);
    return;
  } catch (error) {
    errorResponse(res, (error as Error).message);
    return;
  }
};
