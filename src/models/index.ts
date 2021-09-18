import dbConfig from "../config/db.config"
import mongoose from "mongoose";
import UserModel  from "./user.model"
import TipModel  from "./tip.model"
mongoose.Promise = global.Promise;
const db:any = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.User = UserModel
db.Tip = TipModel

module.exports = db;