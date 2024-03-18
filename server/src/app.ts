import express, { Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes";
import Auth from "./utils/auth";
import verifyToken from "./middlewares/verifyToken";

import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";

class App {
  public server;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.server.use(express.json());
    this.server.use(cookieParser());
    this.server.use(
      cors({
        origin: "http://localhost:5173",
        methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
        credentials: true,
      })
    );
    this.server.get("/verifyUser", verifyToken, (req: any, res: Response) => {
      res.json(req.user);
    });
  }
  routes() {
    this.server.use("/", UserRoutes);
    this.server.use("/auth", Auth);
  }
}

export default new App().server;
