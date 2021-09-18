
import jsonwebtoken from "jsonwebtoken"
import * as fs from 'fs';
import config from "../config"
import DB from "../models";
const  User  = DB.User

var publicKEY = fs.readFileSync(__dirname+'/../config/public.key', 'utf8');
 function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
        var response = { "message": "No token provided" };
        return res.status(403).send(response);
    }
    jsonwebtoken.verify(token, publicKEY, config.signOptions, async function (err, decoded:any) {
        if (err) {
            var response:any = { "message": "Failed to authenticate token" };
            return res.status(403).send(response);
        }
        const user = await User.findOne({_id:decoded._id})
        if (new Date(user.last_login_time).getTime()!==new Date(decoded.last_login_time).getTime()) {
            var response:any = { logout:true };
            return res.status(403).send(response);
        }
        req.user = decoded;
        next();
    });
}
export default verifyToken