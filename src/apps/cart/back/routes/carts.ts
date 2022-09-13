import { Router } from "express";
import container from "../dependencyInjection";

const cartsGetByIdController = container.get(
  "Apps.CartsMs.controllers.CartsGetByIdController"
);
const cartsPostController = container.get(
  "Apps.CartsMs.controllers.CartsPostController"
);
const cartsItemsGetAllController = container.get(
  "Apps.CartsMs.controllers.CartsItemsGetAllController"
);
const cartItemsPostController = container.get(
  "Apps.CartsMs.controllers.CartsItemsPostController"
);

const router = Router();
router.get(
  "/carts/:id",
  cartsGetByIdController.run.bind(cartsGetByIdController)
);
router.post("/carts", cartsPostController.run.bind(cartsPostController));
router.get(
  "/carts/:cartId/items",
  cartsItemsGetAllController.run.bind(cartsItemsGetAllController)
);
router.post(
  "/carts/:cartId/items",
  cartItemsPostController.run.bind(cartItemsPostController)
);

export default router;
