import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Product, * as productService from '../services/productService';
import { buildFilter, buildProductAggregationPipeline } from '../services/productFilters';
import { failResponse, successResponse, errorResponse } from '../utils/response';
import { StatusCode } from '../utils/StatusCodes';
import { Messages } from '../utils/Constants';

// Create new products (handling multiple products)
export const createProducts = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    failResponse(res, errors.array(), StatusCode.Bad_Request);
    return;
  }
  try {
    const products = await productService.createProducts(req.body);
    successResponse(res, products, Messages.Success, StatusCode.Created);
    return;
  } catch (error) {
    errorResponse(res, (error as Error).message);
    return;
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sortBy, page = 1, limit = 10, ...filterQuery } = req.query;
    // Build the aggregation pipeline with the updated filters
    const pipeline = await buildProductAggregationPipeline(
      filterQuery,
      Number(page),
      Number(limit)
    );
 
    const products = await Product.aggregate(pipeline);
  
    const totalCount = await Product.countDocuments(await buildFilter(filterQuery));
    const hasMore = (Number(page) - 1) * Number(limit) + products.length < totalCount;
    successResponse(res, {
      products,
      totalCount,
      hasMore,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)),
    });
  } catch (error) {
    errorResponse(res, 'Error fetching products by filters');
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      failResponse(res, Messages.No_Products_Found_For_This_Category, StatusCode.Not_Found);
      return;
    }
    successResponse(res, { product });
    return;
  } catch (error) {
    errorResponse(res, (error as Error).message);
    return;
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  console.log('jdsjfkjnaskjdnfjkd')
  if (!errors.isEmpty()) {
    failResponse(res, errors.array(), StatusCode.Bad_Request);
    return;
  }
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
      failResponse(res, Messages.Product_Not_Found, StatusCode.Not_Found);
      return;
    }
    successResponse(res, product, Messages.Product_Created);
    return;
  } catch (error) {
    errorResponse(res, (error as Error).message);
    return;
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
      failResponse(res, Messages.Product_Not_Found, StatusCode.Not_Found);
      return;
    }
    successResponse(res, null, Messages.Product_Deleted, StatusCode.No_Content);
    return;
  } catch (error) {
    errorResponse(res, (error as Error).message);
    return;
  }
};

// Get products by category ID
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  const { categoryId } = req.params;
  try {
    const products = await productService.getProductsByCategory(categoryId);
    if (!products.length) {
      failResponse(res, Messages.No_Products_Found_For_This_Category, StatusCode.Not_Found);
      return;
    }
    successResponse(res, products);
    return;
  } catch (error) {
    errorResponse(res, Messages.Error_Fetching_Products_By_Categories);
    return;
  }
};
