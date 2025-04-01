import express from 'express';
import {
  createPurchase,
  getPurchasesByPharmacy,
  updatePurchaseStatus,
  getPurchaseById,
  updateShippingAddress
} from '../controller/purchaseController.js';

const router = express.Router();

// Create a new purchase (with address)
router.post('/', createPurchase);

// Get purchases by pharmacy name
router.get('/pharmacy/:pharmacyName', getPurchasesByPharmacy);

// Get single purchase by ID
router.get('/:id', getPurchaseById);

// Update purchase status
router.put('/:id/status', updatePurchaseStatus);

// Update shipping address
router.put('/:id/address', updateShippingAddress);

export default router;