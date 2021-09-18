import express from "express";
import UserController from "../controllers/user.controller";
const Router = express.Router();
Router.post("/", UserController.signup);
Router.post("/login",UserController.signin);

export default Router