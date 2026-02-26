import express from 'express';
import * as invoiceController from '../controllers/invoice.controller.js';
import protect, { admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes (require at least authentication)
router.get('/number/:invoiceNumber', protect, invoiceController.getInvoiceByNumber);
router.get('/booking/:bookingId', protect, invoiceController.getInvoiceByBooking);
router.get('/', protect, admin, invoiceController.getAllInvoices);
router.get('/:id', protect, invoiceController.getInvoiceById);

// Admin only routes for modification
router.post('/', protect, admin, invoiceController.createInvoice);
router.put('/:id', protect, admin, invoiceController.updateInvoice);
router.put('/:id/payment', protect, admin, invoiceController.updatePaymentStatus);
router.delete('/:id', protect, admin, invoiceController.deleteInvoice);

export default router;
