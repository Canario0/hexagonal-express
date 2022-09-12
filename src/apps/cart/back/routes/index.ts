import { Router } from "express";
import * as health from "@cloudnative/health-connect";
import CartsRouter from "./carts";

export default function registerRoutes(router: Router) {
  const healthcheck = new health.HealthChecker();
  router.use("/live", health.LivenessEndpoint(healthcheck));
  router.use("/ready", health.ReadinessEndpoint(healthcheck));
  router.use("/health", health.HealthEndpoint(healthcheck));
  router.use("/api/v1", CartsRouter);
}
