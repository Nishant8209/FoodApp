import mongoose, { ObjectId } from "mongoose";

import { Messages } from "../utils/Constants";
import { IOrder } from "../models/interfaces";
import Orders from "../models/Order";
import Product from "../models/product";
import { buildPaginationQuery } from "../utils/appFunctions";

// Order Selected Fields
const selectedFields = ` paymentInfo 
products  totalAmount 
sgst cgst    
createdAt updatedAt discount orderId TokenNumber`;

export const createOrderService = async (order: IOrder): Promise<IOrder> => {
  try {
    const { products, totalAmount, sgst, cgst } = order;

    let verifiedTotal = 0;
    let allProducts = [];
    for (const item of products) {
      if (!mongoose.Types.ObjectId.isValid(`${item.product}`)) {
        throw new Error("Invalid product");
      }
      const product = await Product.findById(item.product).exec();
      if (!product) throw new Error("Invalid product");
      verifiedTotal += product.price * item.quantity;
      item.priceSnapshot = product.price;
      allProducts.push(item);
    }

    if (sgst) verifiedTotal += sgst;
    if (cgst) verifiedTotal += cgst;
  
    if (parseFloat(verifiedTotal.toFixed(2)) !== totalAmount) {
      throw new Error(Messages.Order_Total_Mismatch);
    }

    order.products = allProducts;

    // ✅ Generate TokenNumber - Improved Logic
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const ordersToday = await Orders.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    order.TokenNumber = ordersToday + 1;

    const newOrder = new Orders(order);
    newOrder.createdBy = order.userId as ObjectId;
    newOrder.updatedBy = order.userId as ObjectId;

    const savedOrder = await newOrder.save();

    // Generate unique Order ID
    const totalOrders = await Orders.countDocuments();
    const year = new Date().getFullYear();
    savedOrder.orderId = `ORD${year}${totalOrders + 1}`;
    const orderObj = await savedOrder.save();

    console.log("TokenNumber:", orderObj.TokenNumber);
    return orderObj;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getAllOrdersService = async (query: any, params: any = {}) => {
  try {
    const { skip, limit, page } = buildPaginationQuery(query);
    const { orderId } = query;

    let searchFilter: any = {
      $and: [orderId && { orderId: { $regex: orderId, $options: "i" } }].filter(
        (option) => !!option
      ),
    };

    console.log("orderId", searchFilter);
    const totalRecords = await Orders.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalRecords / limit);
    const hasMore = page < totalPages;

    const orders = await Orders.find(searchFilter)
      .populate({
        path: "products.product",
        select: "name price description images",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .exec();

    return {
      orders,
      meta: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
        hasMore,
      },
    };
  } catch (err) {
    console.log("err", err);
    throw new Error((err as Error).message);
  }
};

export const getOrdersByIdService = async (orderId: string) => {
  try {
    return await Orders.findById(orderId).select(selectedFields).populate({
      path: "products.product",
      select: "name price description images",
    });
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
