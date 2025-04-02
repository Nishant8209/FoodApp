import { Request, Response } from "express";
import { createPayPalPayment } from "../services/paymentService";

import { Messages } from "../utils/Constants";
import { errorResponse, failResponse, successResponse } from "../utils/response";

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { totalAmount } = req.body as { totalAmount: number };

    if (!totalAmount || typeof totalAmount !== "number") {
      // Call the response helper, then return
      failResponse(res, "Invalid total amount", 400);
      return;
    }

    const response = await createPayPalPayment(totalAmount);
    if (response.error) {
      errorResponse(res, response.error, 500, response.details);
      return;
    }

    successResponse(res, response, Messages.Success, 200);
  } catch (error) {
    console.error("Payment creation error:", error);
    errorResponse(res, Messages.Internal_Server_Error, 500);
  }
};
