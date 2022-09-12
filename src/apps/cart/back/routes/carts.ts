import { Router } from "express";
import container from "../dependencyInjection";

const cartsGetByIdController = container.get(
  "Apps.CartsMs.controllers.CartsGetByIdController"
);
const cartsPostController = container.get(
  "Apps.CartsMs.controllers.CartsPostController"
);
const router = Router();
router.get(
  "/carts/:id",
  cartsGetByIdController.run.bind(cartsGetByIdController)
);
router.post("/carts", cartsPostController.run.bind(cartsPostController));
router.get("/carts/:cartId/items");
router.post("/carts/:cartId/items");

export default router;
