import paypal from "../config/paypalConfig";

interface PaymentResponse {
  approvalUrl?: string;
  transactionId?: string;
  error?: string;
  details?: any;
}

export const createPayPalPayment = (totalAmount: number): Promise<PaymentResponse> => {
  const formattedTotal = totalAmount.toFixed(2);

  const createPaymentJson = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: `${process.env.FRONTENDURL}/payment-success`,
      cancel_url: `${process.env.FRONTENDURL}/error`,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Food Order Payment",
              sku: "FOOD001",
              price: formattedTotal,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: formattedTotal,
        },
        description: "Payment for your food order.",
      },
    ],
  };

  return new Promise<PaymentResponse>((resolve, reject) => {
    paypal.payment.create(createPaymentJson, (error, payment) => {
        if (error) {
          console.error("PayPal Error:", JSON.stringify(error.response, null, 2));
          return reject({ error: "Payment creation failed", details: error.response });
        }
      

      
        const approvalUrl = payment.links?.find((link) => link.rel === "approval_url")?.href;
        if (approvalUrl) {
          resolve({ approvalUrl, transactionId: payment.id });
        } else {
          reject({ error: "Approval URL not found", details: payment });
        }
      });
      
  });
};
