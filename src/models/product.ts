import mongoose, { Document, Schema } from 'mongoose';
import { IBasicFields } from './interfaces';

interface Image {
  url: string;
  altText: string;
}

export interface ProductDocument extends IBasicFields {
  name: string;
  description: string;
  category: mongoose.Types.ObjectId;
  price: number;
  isBestSeller: boolean;
  images: Image[];
  averageRating: number;
}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  images: [
    {
      url: { type: String, required: true },
      altText: { type: String, required: true },
    },
  ],
  averageRating: { type: Number, default: 0 },
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  isActive: { type: Boolean, default: true }
},
  { timestamps: true });

export default mongoose.model<ProductDocument>('Product', productSchema);