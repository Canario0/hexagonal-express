import { Router } from "express";
import container from "../dependencyInjection";

const cartsGetByIdController = container.get(
  "Apps.CartsMs.controllers.CartsGetByIdController"
);

const router = Router();
router.get(
  "/carts/:id",
  cartsGetByIdController.run.bind(cartsGetByIdController)
);
router.post("/carts");
router.get("/carts/:cartId/items");
router.post("/carts/:cartId/items");

export default router;
