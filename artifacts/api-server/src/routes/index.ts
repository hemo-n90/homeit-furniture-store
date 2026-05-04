import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import ordersRouter from "./orders";
import homepageRouter from "./homepage";
import contactRouter from "./contact";
import wishlistRouter from "./wishlist";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(homepageRouter);
router.use(contactRouter);
router.use(wishlistRouter);
router.use(uploadRouter);

export default router;
