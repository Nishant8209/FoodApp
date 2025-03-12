import { BasicQueryFields } from '../models/interfaces';
import Product, { ProductDocument } from '../models/product';
import { buildPaginationQuery } from '../utils/appFunctions';

interface GetRecentlyViewProducts extends BasicQueryFields {

}

interface GetRelatedProducts extends BasicQueryFields {
  productId: string
}

// Create new products (handling multiple products)
export const createProducts = async (productData: any[]): Promise<ProductDocument[]> => {
  try {
    const products = await Promise.all(
      productData.map(async (data) => {
        const product = new Product(data);
        await product.save();
        return product;
      })
    );
    return products;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getAllProducts = async (filter: any = {}, sortOptions: any = {}): Promise<ProductDocument[]> => {
  try {
    const products = await Product.find(filter).sort(sortOptions);
    return products;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<ProductDocument | null> => {
  try {
    const product = await Product.findById(id).exec();
    return product;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Update a product
export const updateProduct = async (id: string, data: any): Promise<ProductDocument | null> => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return updatedProduct;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<ProductDocument | null> => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Get products by category ID
export const getProductsByCategory = async (categoryId: string): Promise<ProductDocument[]> => {
  try {
    const products = await Product.find({ category: categoryId }).exec();
    return products;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// export const getRecentlyViewedProductsService = async (query: GetRecentlyViewProducts, productIds: string[]): Promise<any> => {
//   try {
//     const { skip, limit, page } = buildPaginationQuery(query);
//     const searchFilter = { _id: { $in: productIds } }
//     const totalRecords = await Product.countDocuments(searchFilter);
//     const totalPages = Math.ceil(totalRecords / limit);
//     const hasMore = page < totalPages;
//     const products = await Product.find(searchFilter)
//       .skip(skip)
//       .limit(limit)
//       .exec();

//     return {
//       products,
//       meta: {
//         totalRecords,
//         totalPages,
//         currentPage: page,
//         limit,
//         hasMore,
//       }
//     };
//   } catch (error) {
//     throw new Error((error as Error).message);
//   }
// }


// export const getRelatedProductsService = async (query: GetRelatedProducts): Promise<any> => {
//   try {
//     const { skip, limit, page } = buildPaginationQuery(query);
//     const { productId } = query;
//     const product = await getProductById(productId);
//     const searchFilter = { subCategories: { $in: product?.subCategories || [] } }
//     const totalRecords = await Product.countDocuments(searchFilter);
//     const totalPages = Math.ceil(totalRecords / limit);
//     const hasMore = page < totalPages;
//     const products = await Product.find(searchFilter).populate("subCategories", '_id name description')
//       .skip(skip)
//       .limit(limit)
//       .exec();
//     return {
//       products,
//       meta: {
//         totalRecords,
//         totalPages,
//         currentPage: page,
//         limit,
//         hasMore,
//       }
//     };
//   } catch (error) {
//     throw new Error((error as Error).message);
//   }
// }
export default Product;