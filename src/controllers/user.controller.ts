
import * as fs from 'fs';
import Validator from 'node-input-validator';
import DB from "../models";
import bcrypt  from "bcryptjs";
import config from "../config"
import mailSend from "../helpers/mailer"
import jsonwebtoken from "jsonwebtoken"
const { ObjectId } = DB.mongoose.Types
const  User  = DB.User
const privateKEY = fs.readFileSync(__dirname+"/../config/private.key", 'utf8');

const signup = (req, res) => {
    console.log("here",req.body)
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      proPic:req.file && req.file.filename || ""
    });
  
    user.save((err, user) => {
      if (err) {
        return res.status(500).send({ message: err.message || "Something went wrong" });
      }
      const { _id, last_login_time } = user;
      mailSend({name:user.name,email:user.email,subject:"Welcome"})
      const token = jsonwebtoken.sign({ _id, last_login_time }, privateKEY, config.signOptions);
      return res.status(201).send({ name:user.name, token:token });
  
    });
  };
  
const signin = (req, res) => {
    User.findOneAndUpdate(
     {
      email: req.body.email
      },
      {
      $set:{
             last_login_time:new Date()
           }
    },
    {
    new:true
   },(err, user:any ) => {
       console.log(user)
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        if (!user) {
          return res.status(400).send({ message: "User Not found." });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid credentials"
          });
        }
  
        const { _id, last_login_time } = user;
        const token = jsonwebtoken.sign({ _id, last_login_time }, privateKEY, config.signOptions);
        return res.status(200).send({ name:user.name, token:token });
      });
  };

export default {signin,signup}