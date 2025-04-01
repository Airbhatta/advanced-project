import express from "express";
import { 
  uploadPrescription, 
  getPrescriptionsByPharmacy
} from "../controller/Prescriptioncontroller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single('prescription'), uploadPrescription);
// In your prescriptionRoutes.js
router.get("/pharmacy/:pharmacyName", getPrescriptionsByPharmacy);


export default router;