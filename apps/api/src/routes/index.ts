import { Router } from "express";
import profileRoutes from "./profile.routes.js";
import productsRoutes from "./products.routes.js";

const router = Router();

// Mount route modules
router.use("/profile", profileRoutes);
router.use("/products", productsRoutes);

export default router;
