import mongoose, { ObjectId, Document } from "mongoose";


export interface IBasicFields extends Document {
  isActive: boolean;
  createdAt: Date;
  createdBy: ObjectId;
  updatedAt: Date;
  updatedBy: ObjectId,
  status: string,
  version: number
}

export interface BasicQueryFields {
  search?: string,
  page?: number,
  limit?: number,
  userType?: string,
  status?: string
}








export interface ImageInfo {
  url: string;
  altText?: string;
  order?: number;
}






export interface ProductDocument extends Document {
name: string;
  description: string;
  category: string;
  price: number;
  isBestSeller: boolean;
  images?: ImageInfo[];
  averageRating: number;
}

export interface OrderProductInfo {
  product: ObjectId,
  quantity: number,
  priceSnapshot: number,
}

export interface IOrder extends IBasicFields {
  userId: ObjectId,
  products: OrderProductInfo[
  
  ],
  TokenNumber:number,
  paymentInfo: {
    method: string, // e.g., 'Credit Card', 'PayPal', 'COD'
    status: string, // 'Pending', 'Paid', 'Failed'
    transactionId: string, // Optional, for tracking payment
  },

  discount: {
    couponCode: string //'SAVE20',
    amount: number
  }
 
  totalAmount: number,
  sgst:number,
  cgst:number,
  orderId: string
}