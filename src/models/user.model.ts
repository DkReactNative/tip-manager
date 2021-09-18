import { Schema, model, connect } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt  from "bcryptjs";
const UPLOAD_FOLDER_URL = process.env.apiUrl + "/public";


interface User {
  name: string;
  email: string;
  password:string;
  proPic?: string;
  last_login_time: Date,   
  is_active: number,
  deletedAt: Date | null
}

const UserSchema = new Schema<User>({
  name: {
            type: String, 
            required: [true, "Name must be provided"],
            maxlength: [55, "Name must no more than 55 chanracters"],
            minlength: [3,  "Name must  more than 2 chanracters"],
            trim: true
       },
  email: { 
            type: String,
            unique:true, 
            required: true, 
            trim:true,
            lowercase:true,
            sparse: true,
            validate:[isEmail,"Please fill a valid email address"] 
    },
  password: {
            type: String,
            trim: true,
            required: [
              true,
              "Password must be provided.",
            ],       
  },
  proPic: String,
  is_active: { type: Number, enum: [1, 0], default: 1 },  
  last_login_time: { type: Date }, 
  deletedAt: { type: Date ,default:null}, 
},{ 
    timestamps:true,
    autoIndex: true, 
    toObject: { virtuals: true,getters:true }, 
    toJSON: { virtuals: true,getters:true } 
  })

UserSchema.pre("save", function (next) {
  const user = this

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError)
      } else {
        bcrypt.hash(user.password, salt, function(hashError, hash) {
          if (hashError) {
            return next(hashError)
          }
          user.password = hash
          next()
        })
      }
    })
  } else {
    return next()
  }
})

UserSchema.virtual('proPic').get(function (value) {
  if (this.proPic != "" && typeof this.proPic !== undefined) {
      return UPLOAD_FOLDER_URL + "/" + this._id + "/" + this.proPic;
  } else {
      return UPLOAD_FOLDER_URL + "/public/placeholder-user.jpg";
  }
});

const UserModel = model<User>('User', UserSchema);

export default UserModel