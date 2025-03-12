import mongoose, { model } from "mongoose";
import {  IOrder } from "./interfaces";
import { PaymentMethod, PaymentStatus } from "../utils/Constants";
const orderSchema = new mongoose.Schema({
 
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true // Reference to the product
            },
            quantity: {
                type: Number,
                required: true // Number of units of this product in the order
            },
            priceSnapshot: {
                type: Number,
                required: true // Price of the product at the time of the order
            },
        }
    ],
    
    discount: {
        couponCode: {
            type: String,
            default: 'SAVE0'
        },
        amount: {
            type: Number,
            default: 0
        }
    },
    paymentInfo: {
        method: { type: String, required: true }, // e.g., 'Credit Card', 'PayPal', 'COD'
        status: { type: String, default: PaymentStatus.Pending }, // 'Pending', 'Paid', 'Failed'
        transactionId: { type: String }, // Optional, for tracking payment
    },
    
    totalAmount: {
        type: Number,
        required: true, // Total cost of the order (calculated from products)
    },
    taxAmount: {
        type: Number, // Tax calculated on the order (optional)
        default: 0,
    },
    
    orderId: {
        type: String,
        default: Date.now
    },
    TokenNumber:{type: Number},
    sgst:{type:Number},
    cgst:{type:Number},
    version: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    isActive: { type: Boolean, default: true }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

export default model<IOrder>('Order', orderSchema);

