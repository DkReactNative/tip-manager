import express from "express";
import TipController from "../controllers/tip.controller";
import verifyToken from "../middlewares/verifyToken";

const Router = express.Router();
Router.post("/",verifyToken,TipController.calculate);
Router.get("/", verifyToken,TipController.analytics);

export default Router
