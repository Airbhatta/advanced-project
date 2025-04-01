import Purchase from '../models/Purchase.js';

// Create new purchase with address
export const createPurchase = async (req, res) => {
  try {
    const { 
      customerEmail, 
      customerName,
      customerPhone,
      pharmacy,
      products,
      totalAmount,
      shippingAddress
    } = req.body;

    // Validate required address fields
    if (!shippingAddress?.street || !shippingAddress?.city || 
        !shippingAddress?.state || !shippingAddress?.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required address fields'
      });
    }

    const newPurchase = new Purchase({
      customerEmail,
      customerName,
      customerPhone: customerPhone || '',
      pharmacy,
      products,
      totalAmount,
      shippingAddress: {
        ...shippingAddress,
        country: shippingAddress.country || 'USA'
      },
      status: 'pending'
    });

    await newPurchase.save();
    
    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      purchase: newPurchase
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get purchases by pharmacy
export const getPurchasesByPharmacy = async (req, res) => {
  try {
    const { pharmacyName } = req.params;

    const purchases = await Purchase.find({ pharmacy: pharmacyName })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: purchases.length,
      purchases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single purchase by ID
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    res.status(200).json({
      success: true,
      purchase
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update purchase status
export const updatePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'completed', 'shipped', 'delivered'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedPurchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Purchase status updated',
      purchase: updatedPurchase
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update shipping address
export const updateShippingAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { shippingAddress } = req.body;

    // Validate address fields
    if (!shippingAddress?.street || !shippingAddress?.city || 
        !shippingAddress?.state || !shippingAddress?.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required address fields'
      });
    }

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      id,
      { shippingAddress },
      { new: true, runValidators: true }
    );

    if (!updatedPurchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shipping address updated',
      purchase: updatedPurchase
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};