import { Request, Response } from 'express';
import { failResponse, successResponse, errorResponse } from '../utils/response';
import { StatusCode } from '../utils/StatusCodes';
import {  Messages } from '../utils/Constants';

import { createOrderService, getAllOrdersService, getOrdersByIdService } from '../services/orderSerivice';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
       
        const orderCreated = await createOrderService(req?.body);
        successResponse(res, { orderId: orderCreated._id }, Messages.OrderCreated, StatusCode.OK);
    } catch (error) {
        console.log('Error', error)
        errorResponse(res, (error as Error).message || Messages.OrderCreating_Error, StatusCode.Bad_Request);
    }
};



export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const allOrders = await getAllOrdersService(req.query);
        successResponse(res, allOrders, '', StatusCode.OK);
    } catch (err) {
        errorResponse(res, (err as Error).message, StatusCode.Bad_Request);
    }
}

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;
        const order: any = await getOrdersByIdService(orderId);
        successResponse(res, { order }, '', StatusCode.OK);
    } catch (err) {
        errorResponse(res, (err as Error).message, StatusCode.Bad_Request);
    }
}



// export const deleteOrderById = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { orderId } = req.params;
//         const order: any = await updateOrderByIdService(orderId, { isActive: false } as IOrder);
//         successResponse(res, { orderId }, Messages.Order_Deleted, StatusCode.OK);
//     } catch (err) {
//         errorResponse(res, (err as Error).message, StatusCode.Bad_Request);
//     }
// }

