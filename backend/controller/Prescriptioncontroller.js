import Prescription from "../models/Prescription.js";
import fs from 'fs';
import path from 'path';

export const uploadPrescription = async (req, res) => {
  try {
    const { pharmacy, customerEmail, customerName } = req.body;

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No prescription file uploaded" 
      });
    }

    if (!pharmacy || !customerEmail || !customerName) {
      // Clean up uploaded file if validation fails
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newPrescription = new Prescription({
      pharmacy: pharmacy.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerName: customerName.trim(),
      file: req.file.path,
      status: 'Pending'
    });

    await newPrescription.save();

    res.status(201).json({
      success: true,
      message: "Prescription uploaded successfully",
      prescription: {
        ...newPrescription.toObject(),
        fileUrl: `${req.protocol}://${req.get('host')}/uploads/${path.basename(req.file.path)}`
      }
    });

  } catch (error) {
    console.error("Prescription upload error:", error);
    // Clean up uploaded file if error occurs
    if (req.file) fs.unlinkSync(req.file.path);
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to upload prescription",
      error: error.message 
    });
  }
};

export const getPrescriptionsByPharmacy = async (req, res) => {
  try {
    const { pharmacyName } = req.params;
    
    if (!pharmacyName) {
      return res.status(400).json({
        success: false,
        message: "Pharmacy name is required"
      });
    }

    // Case-insensitive search and trim whitespace
    const prescriptions = await Prescription.find({ 
      pharmacy: { $regex: new RegExp(pharmacyName.trim(), 'i') } 
    }).sort({ createdAt: -1 });

    // Fix file URLs - handle both Windows and Unix paths
    const prescriptionsWithUrls = prescriptions.map(p => {
      const filename = p.file.includes('\\') 
        ? p.file.split('\\').pop() 
        : p.file.split('/').pop();
      
      return {
        ...p.toObject(),
        fileUrl: `/uploads/${filename}`
      };
    });

    res.json({
      success: true,
      prescriptions: prescriptionsWithUrls
    });

  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch prescriptions"
    });
  }
};