import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import prescriptionRoutes from "./routes/PrescriptionRoutes.js";


import purchaseRoutes from "./routes/purchaseRoutes.js";


import cors from "cors";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/prescriptions', prescriptionRoutes);


app.use("/api/purchases", purchaseRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});