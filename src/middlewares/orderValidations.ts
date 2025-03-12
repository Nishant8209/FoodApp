import { body } from 'express-validator';

export const validateOrder = [

    body('products').notEmpty().withMessage('Products are required'),
 
    body('paymentInfo').notEmpty().withMessage('paymentInfo is required'),
    body('totalAmount').notEmpty().isNumeric().withMessage('totalAmount is required'),
    body('taxAmount').notEmpty().isNumeric().withMessage('taxAmount is required'),

];

