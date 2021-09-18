import { Schema, model, connect } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt  from "bcryptjs";
const UPLOAD_FOLDER_URL = process.env.apiUrl + "/public";


interface Tip {
  place: string;
  totalAmount: number;
  tipPercentage:number;
  tipAmount:number,
  deletedAt: Date | null
}

const TipSchema = new Schema<Tip>({
  place: {
              type: String, 
              required: [true, "Place must be provided"],
              maxlength: [155, "Place must no more than 155 chanracters"],
              minlength: [5,  "Place must  more than 5 chanracters"],
              trim: true
        },
  totalAmount: { 
              type: Number,
              required: true, 
      },
      tipPercentage: { 
        type: Number,
        required: true, 
  },
  tipAmount: { 
    type: Number,
    required: true, 
  },
  deletedAt: { type: Date ,default:null}, 
},{ 
    timestamps:true,
    autoIndex: true, 
    toObject: { virtuals: true,getters:true }, 
    toJSON: { virtuals: true,getters:true } 
  })
const TipModel = model<Tip>('Tip', TipSchema);
export default TipModel