import express from "express";
import multer from "multer";
import mime from "mime";
import UserController from "../controllers/user.controller";
import crypto  from "crypto";
import ValidImage from "../helpers/validImage"

var userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/user/");
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(
                null,
                raw.toString("hex") + Date.now() + "." + mime.getExtension(file.mimetype)
            );
        });
    }
});
var upload = multer({ storage: userStorage, fileFilter: ValidImage, limits: { fileSize: 5 * 1024 * 1024 } }).single("proPic");
const Router = express.Router();
Router.post("/", [
    function (req, res, next) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                let response = { "message": err.message };
                return res.json(response);
            } else if (err) {
                let response = { "message": err.mesage};
                return res.status(500).send(response);
            }
            next();
        })
    }],
 UserController.signup);
Router.post("/login",UserController.signin);

export default Router