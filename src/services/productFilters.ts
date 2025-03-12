import { FilterQuery } from "mongoose";
import { ProductDocument } from "../models/product";
import Category from "../models/Category";

// Function to build the filter object
export const buildFilter = async (
  query: any
): Promise<FilterQuery<ProductDocument>> => {
  const filter: FilterQuery<ProductDocument> = {};

  try {
    const {
      category,
      categoryName,
      name,
      isPopular,
      minPrice,
      maxPrice,
      startDate,
      endDate,
    } = query;

    // Category filter logic (supports multiple categories)
    if (category) {
      const categories = Array.isArray(category) ? category : [category];
      const categoryDocs = await Category.find({ name: { $in: categories } }).select('_id');
      const categoryIds = categoryDocs.map((cat) => cat._id);

      if (categoryIds.length) {
        filter.category = { $in: categoryIds };
      } else {
        console.warn(`No matching categories found for: ${categories.join(", ")}`);
      }
    }

    // Filter by `categoryName` (alternative category search logic)
    if (categoryName) {
      const foundCategory = await Category.findOne({ name: categoryName });
      if (foundCategory) {
        filter.category = foundCategory._id;
      } else {
        console.warn(`Category "${categoryName}" not found.`);
      }
    }

    // Search by product name (case-insensitive)
    if (name) {
      let queryName = name.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
      queryName = decodeURIComponent(queryName);
      filter.name = { $regex: queryName, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Filter by Popular products
    if (isPopular) {
      filter.isPopular = isPopular === 'true';
    }

    // Filter by Date Range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    console.log('filter', filter);
    return filter;
  } catch (err) {
    console.error('Filter Query Error:', err);
    return filter;
  }
};

// Pagination logic
export const getPagination = (page: number, limit: number) => {
  const pageNum = parseInt(page as unknown as string, 10) || 1;
  const limitNum = parseInt(limit as unknown as string, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, skip };
};

// Aggregation pipeline builder
export const buildProductAggregationPipeline = async (
  filterQuery: any,
  page: number,
  limit: number
) => {
  const filter = await buildFilter(filterQuery);
  const { limitNum, skip } = getPagination(page, limit);

  return [
    { $match: filter },

    // Lookup to get category details
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },

    { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },

    {
      $project: {
        name: 1,
        description: 1,
        price: 1,
        category: {
          name: "$categoryDetails.name",
          description: "$categoryDetails.description",
        },
        images: 1,
        isPopular: 1,
        createdAt: 1,
      },
    },

    { $skip: skip },
    { $limit: limitNum },
  ];
};
