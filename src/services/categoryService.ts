import Category, { CategoryDocument } from '../models/Category';

import { Messages } from '../utils/Constants';

// Create Category - returns an array of CategoryDocument
export const createCategory = async (data: any): Promise<CategoryDocument[]> => {
  if (Array.isArray(data)) {
    const docs = await Category.insertMany(data);
    return docs.map((doc) => doc.toObject() as CategoryDocument); // Correctly returning an array of documents
  } else {
    const doc = await new Category(data).save();
    return [doc.toObject() as CategoryDocument]; // Still returning an array even for a single document
  }
};

// Get all categories along with subcategory details (name and description)
export const getAllCategories = async (): Promise<CategoryDocument[]> => {
  try {
    // Fetch categories and populate the subcategories field with name and description
    const categories = await Category.find()
      .lean<CategoryDocument[]>()
      .exec();
    return categories; // Return array of CategoryDocuments with populated subcategories
  } catch (error) {
    throw new Error( Messages.Error_Fetching_Categories );
  }
};

// Get Category By ID - returns a single CategoryDocument or null
export const getCategoryById = async (id: string): Promise<CategoryDocument | null> => {
  try {
    const category = await Category.findById(id).lean<CategoryDocument>().exec();
    return category; // Return single CategoryDocument or null
  } catch (error) {
    throw new Error( Messages.Error_Fetching_Categories_ID );
  }
};

// Update Category - returns the updated CategoryDocument or null
export const updateCategory = async (id: string, data: any): Promise<CategoryDocument | null> => {
  try {
    const updatedDoc = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .lean<CategoryDocument>()
      .exec(); // Execute and ensure typing
    return updatedDoc; // Return updated CategoryDocument or null
  } catch (error) {
    throw new Error( Messages.Error_Updating_Category );
  }
};

// Delete Category - returns the deleted CategoryDocument or null
export const deleteCategory = async (id: string): Promise<CategoryDocument | null> => {
  try {
    const deletedDoc = await Category.findByIdAndDelete(id).lean<CategoryDocument>().exec(); // Execute and ensure typing
    return deletedDoc; // Return deleted CategoryDocument or null
  } catch (error) {
    throw new Error( Messages.Error_deleting_Category );
  }
};