import express, { Request, Response } from "express";
import * as http from "http";
import httpStatus from "http-status";
import morgan from "morgan";
import Logger from "../../../contexts/shared/domain/logger";
import container from "./dependencyInjection";
import registerRoutes from "./routes";

export default class Server {
  private express: express.Express;
  readonly port: string;
  private logger: Logger;
  httpServer?: http.Server;

  constructor(port: string) {
    this.port = port;
    this.logger = container.get("Shared.Logger");
    this.express = express();
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(morgan("tiny"));
    const router = express.Router();
    this.express.use(router);
    registerRoutes(router);
    router.use((err: Error, req: Request, res: Response, next: Function) => {
      this.logger.error(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
    });
  }

  async listen(): Promise<void> {
    return new Promise((resolve) => {
      this.httpServer = this.express.listen(this.port, () => {
        this.logger.info(
          `Cart Backend App is running at http://localhost:${
            this.port
          } in ${this.express.get("env")} mode`
        );
        this.logger.info("  Press CTRL-C to stop\n");
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close((error) => {
          if (error) {
            return reject(error);
          }
          return resolve();
        });
      }
      return resolve();
    });
  }
}
