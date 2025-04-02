import express from 'express';
import { createPayment } from '../controllers/paymentController';

const router = express.Router();
router.post("/create-payment", createPayment);

export default router;
