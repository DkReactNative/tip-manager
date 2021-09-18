import express from "express";
import TipController from "../controllers/tip.controller";

const Router = express.Router();
Router.post("/",TipController.calculate);
Router.get("/", TipController.analytics);

export default Router
