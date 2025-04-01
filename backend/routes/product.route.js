import express from "express";
import { 
  createProduct, 
  deleteProduct, 
  getProducts, 
  updateProduct,
  buyProduct 
} from "../controller/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:pid/buy", buyProduct);

export default router;