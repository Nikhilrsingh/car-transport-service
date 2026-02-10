import express from 'express';
import * as invoiceController from '../controllers/invoice.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (no authentication required - since login doesn't exist)
// Specific routes MUST come before general patterns to avoid conflicts
router.get('/number/:invoiceNumber', invoiceController.getInvoiceByNumber);
router.get('/booking/:bookingId', invoiceController.getInvoiceByBooking);
router.get('/', invoiceController.getAllInvoices);  // Get all invoices (public for testing)
router.get('/:id', invoiceController.getInvoiceById);

// Protected routes (require authentication for modification)
router.post('/', protect, invoiceController.createInvoice);
router.put('/:id', protect, invoiceController.updateInvoice);
router.put('/:id/payment', protect, invoiceController.updatePaymentStatus);
router.delete('/:id', protect, invoiceController.deleteInvoice);

export default router;
