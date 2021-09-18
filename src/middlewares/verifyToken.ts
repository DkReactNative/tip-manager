
import jsonwebtoken from "jsonwebtoken"
import * as fs from 'fs';
import config from "../config"
var publicKEY = fs.readFileSync(__dirname+'/../config/public.key', 'utf8');
function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
        var response = { "message": "No token provided" };
        return res.status(403).send(response);
    }
    jsonwebtoken.verify(token, publicKEY, config.signOptions, function (err, decoded) {
        if (err) {
            var response = { "message": "Failed to authenticate token" };
            return res.status(403).send(response);
        }
        req.user = decoded;
        next();
    });
}
export default verifyToken