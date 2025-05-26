import { Router } from 'express';
import { topUp, sendPayment, convertCurrency, getPaymentHistory, getBalance } from '../controllers/paymentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all payment routes
router.use(authMiddleware);

router.post('/topup', topUp); // Endpoint for topping up balance
router.post('/send', sendPayment); // Endpoint for sending payments
router.post('/convert', convertCurrency); // Endpoint for currency conversion
router.get('/history', getPaymentHistory); // Endpoint for fetching payment history
router.get('/balance', getBalance); // Endpoint for fetching user balance

export default router;