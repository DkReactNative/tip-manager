import dbConfig from "../config/db.config"
import mongoose from "mongoose";
import UserModel  from "./user.model"
import TipModel  from "./tip.model"
mongoose.Promise = global.Promise;
const db = {mongoose : mongoose, url : dbConfig.url, User :UserModel, Tip : TipModel}
export default db;